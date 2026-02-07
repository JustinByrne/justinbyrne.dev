---
title: Adding Laravel Helper Functions
slug: adding-laravel-helper-functions
author: Justin Byrne
type: post
date: '2024-07-13T16:00:00.000Z'
---

There are times within a Laravel project that you'll need to use a function over and over, but it is not related to any one particular model or controller so doesn't make sense to create a service for the one function. That's where creating a Laravel helper function comes into play.

## Adding the Helper Service Provider

By default Laravel doesn't have a way of adding helper functions out of the box, a service provider to manage all the helper functions will need to be added first. The can be added using the following artisan command

```sh
php artisan make:provider HelperServiceProvider
```

This will create a new provider in the `app/Providers` directory, within the provider the following will need to be added to the `register()` function.

```php
foreach (glob(app_path('Helpers/*.php')) as $fileName) {
    require_once $fileName;
}
```

This will go through each php file in the `app/Helpers` directory (*which will be added later*) and require them in the code base. The last thing to do is to tell Laravel about the new service provider.

Depending on the version of Laravel being used adding the new provider to the project is done in a different way.

### Adding Service Provider to Laravel 11

To add the new provider to the project the array within `bootstrap/providers`.php needs to be updated to include the new provider.

```php
return [
	App\Providers\AppServiceProvider::class,
    App\Providers\HelperServiceProvider::class,
];
```

### Adding Service Provider to Laravel < 10

To add the new provider to the project the providers array in the `config/app`.php needs to be updated to include the new provider.

```php
/*
* Application Service Providers...
*/
App\Providers\AppServiceProvider::class,
...
App\Providers\HelperServiceProvider::class,
```

## Adding a Helper files and functions

With the service provider created and added into the project, helper files can now be created and helper functions added. There are two ways that this can be done, and it's personal preference.

Either you could have a single helper file with all your functions inside similar to `app/Helpers/helpers.php`, or you can split your functions into individual files based on their functionality, for example if you needed functions for the config you could put them in a `app/Helpers/ConfigHelpers.php` file.

In this example there is a config file `config/user.php` which consists of user statuses

```php
return [
    'statuses' => [
        [
            'label' => 'Active',
            'value' => 'active',
        ],
        [
            'label' => 'New User',
            'value' => 'new_user',
        ],
    ],
];
```

Within this config file it has statuses in a multi dimensional array with labels and values. To get the label based on the value can take a couple of lines, which is not a problem until this logic is being used in multiple places. This is the perfect example of needing a helper function.

Within the `app/Helpers/ConfigHelpers.php` file, the following code has been added to create a reusable function.

```php
<?php

if (!function_exists('configGetLabelFromValue')) {
    function configGetLabelFromValue(string $config, string $value): string {
        $config = config($config);
        $index = array_search($value, array_column($config, 'value'));
        
        if ($index !== false) {
        	return $config[$index]['label'];
        }
        
        return '';
    }
}
```

Wrapped around the function is a check to ensure there isn't an existing function named the same to prevent overriding core function. The `configGetLabelFromValue()` function can now be used anywhere within the project, for example within a controller or even within a blade file.