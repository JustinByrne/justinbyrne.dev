---
title: Laravel test validation rules
slug: laravel-test-validation-rules
author: Justin Byrne
type: post
date: '2023-02-08T16:00:00.000Z'
---

# Laravel test validation rules

Building large scaled Laravel apps will require testing. Whether this is done as TDD (Test Driven Development) or after the code is written, it's always a good idea to test validation rules. To do this there are two different ways, the first is to write a test for each validation rule, the other, which I will demonstrate, is to use PHPUnit Dataproviders.

## Create a Test

If you already know how to create a test in Laravel skip this section. However, if testing is new to you here is how to create one and then run the test.

### Artisan command

Creating a new test can be done with a single artisan command. Using the terminal within the Laravel directory, run the following command.

```sh
php artisan make:test UserTest
```

This will create a test file found at `tests/Feature/UserTest.php`. The file will contain a single test that will check if the root URL will return a 200 HTTP status response.

### Writing the test

We can remove the example test and create a new one. This test will check just one of the validation rules.

The following validation rules are set for the `users.store` route within the store function in the `UserController`.

```php
/**
 * Store a new user.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return \Illuminate\Http\Response
 */
public function store(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required|confirmed',
    ]);
    
    // The user is valid...
}
```

We can then write a test to check that if the email is not included in the provided data, then the session errors will contain email.

```php
/**
 * Testing that email validation works
 */
public function test_email_is_not_null(): void
{
    $data = [
        'email' => null,
        'password' => 'password',
        'password_confirmation' => 'password',
    ];
    
    $response = $this->post(route('users.store'), $data);
    $response->assertSessionHasErrors(['email']);
}
```

This is a good test to start with, but as you can see if we want to test each of the validation rules this will take a while and will result in recreating the same function over and over. However, we can prevent the need for that is we use a dataprovider.

## Using a Dataprovider

At this point we have a test that can check a single validation rule, however, we want to test more. To do this we can add a function that will return an array which contains the form input data and the excepted session errors.

### Create the Dataprovider

After the existing validation function add the following.

```php
public function invalidFormData(): array
{
    return [
        'All fields are empty' => [
            [
                'email' => null,
                'password' => null,
                'password_confirmation' => null,
            ],
            ['email', 'password']
        ],
        'Email is not a valid email address' => [
            ['email' => 'This is not an email'],
            ['email']
        ],
        'Passwords dont match' => [
            [
                'password' => 'Strong password',
                'password_confirmation' => 'Weak password']
            ],
            ['password']
        ]
    ];
}
```

That is our dataprovider created, however, we haven't implemented it, but more importantly I haven't explained what it all means. So I'll break down what's what.

```php
public function invalidFormData(): array
{
    //
}
```

Here we are naming the function and using the return type declaration of `array` - *implemented in PHP7.4*. The name isn't specific and can be whatever you need, however by adding the return type the function must return an array.

Within the returned array there are datasets with the key being the name of the dataset. Using the example below we can see the dataset is named `Email is not a valid email address` and this dataset is also an `array`.

```php
'Email is not a valid email address' => [
    //
],
```

Within this dataset we will add two more arrays the first will be the data that is sent to the route, and the second is the expected session errors, in the below example we are adding an incorrect email address and adding email to expected errors.

```php
'Email is not a valid email address' => [
    ['email' => 'This is not an email'],
    ['email']
],
```

### Implement the Dataprovider

With the dataprovider created all that's left to do is to update the test function. I have renamed the function to make more sense, also as you can see below that the function has had a bit of a trim.

```php
/**
 * Test each of the validation rules
 * 
 * @dataProvider invalidFormData
 */
public function test_all_validation($invalidData, $invalidFields): void
{
    $response = $this->post(route('users.store'), $invalidData);
    $response->assertSessionHasErrors($invalidFields);
}
```

Compared to the original test function, this one is not too dissimilar. It is still creating a response to the users.store route and it is still checking that the session has errors. However, this time we have not created a $data variable or passed an array to the session errors assertion as this is all handled by the dataprovider.

#### Breaking down the function

The first difference between the original function and this one has been made to its DocBlock. We have added the `@dataprovider` annotation, alongside outline which function should be used.

```php
/**
 * @dataprovider invalidFormData
 */
```

The next difference is the function parameters. In the previous function there were none, however, now we have some and they look like they have been pulled from thin air.

```php
public function test_all_validation($invalidData, $invalidFields): void
```

However, these relate the arrays in the dataprovider. With `$invalidData` relating to the first array in the data set and `$invalidFields` relating to the second.

From this point the rest of the function is the same. And when the test is ran it will iterate over each of the individual data sets in the dataprovider and run the function for each of them.