---
title: How to display the time between two dates in Laravel
slug: how-to-display-the-time-between-two-dates-in-laravel
author: Justin Byrne
type: post
date: 2024-08-14T16:00:00.000Z
---

Within a Laravel project, or even a PHP project there can be times when the calculation between two date and times is needed. Luckily the Carbon PHP API has some methods for doing exactly that.

Here's the scenario I'll be using to demonstrate; you have a clocking system and you want to see how long an individual has been clocked into the system. For this scenario I have a `Clocking` model set up as followed:

```php
<?php
	
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Clocking extends Model
{
	protected $fillable = [
		'user_id',
		'clock_in_at',
		'clock_out_at',
	];
	
	protected $casts = [
		'clock_in_at' => 'datetime',
		'clock_out_at' => 'datetime',
	];
	
	public function User(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}
}
```

With the model outlined, calculating the time a user has been clocked in should be simple enough. The method that I'll be using from Carbon is the `diffForHumans()` method. This is a chain-able method from a Carbon object that can be passed some parameters and return a string with details about the difference.

The smallest and easiest way to do this is to compare the time clocked in against the current time, to do this the following can be used.

```php
use Carbon\Carbon;

...

$clock_in_at = Clocking::first()->clock_in_at;

return $clock_in_at->diffForHumans(Carbon::now());
```

This will then return a string with the difference but to a single value for example, the `$clock_in_at` is 25 hours before the current date and time then the response provided will be:

`1 day before`

This is okay, but will return the same value for any date and time that is between 25 - 47 hours before the current date and time.

The previous example is okay if only one part of the difference is needed and the before is not an issue, however, if more parts are needed or the before is not desired then the example can be updated return a more informative difference:

```php
use Carbon\Carbon;

...
	
$clock_in_at = Clocking::first()->clock_in_at;

return $clock_in_at->diffForHumans([
	'other' => Carbon::now(),
	'parts' => 2,
	'syntax' => Carbon::DIFF_ABSOLUTE,
]);
```

Using the same details as stated previously, the above example will now return:

`1 day 1 hour`

This is improved over the last as if the difference was 47 hours it would return:

`1 day 23 hours`

providing that extra level of detail. However, there is still more that can be done to improve the output. Adding additional keys such as `join` or `skip` the returned string can be greatly improved. For example using both the returned string can be made to say.

`1 day and 1380 minutes`

This can be achieved like so.

```php
use Carbon\Carbon;

...
	
$clock_in_at = Clocking::first()->clock_in_at;

return $clock_in_at->diffForHumans([
	'other' => Carbon::now(),
	'parts' => 2,
	'join' => ' and ',
	'skip' => 'hours',
	'syntax' => Carbon::DIFF_ABSOLUTE,
]);
```

That may not be the desired outcome but it can be used to make a much more user friendly response.

## Bonus

To round off the example regarding the Laravel model the following attribute can be added to calculate the time clocked in based on either the clock in and out times or the current date and time.

```php
use Illuminate\Database\Eloquent\Casts\Attribute;

...

public function clockedInTime(): Attribute
{
	return Attribute::make(
		get: function () {
			$this->clock_in_at->diffForHumans([
				'other' => $this->clock_out_at ? $this->clock_out_at : Carbon::now(),
				'parts' => 2,
				'join' => ' and ',
				'syntax' => Carbon::DIFF_ABSOLUTE,
			]);
		},
	);
}
```

This can then be used with the following:

```php
return Clocking::first()->clocked_in_time;
```