/* eslint-disable camelcase */
/**
 * https://javascript.plainenglish.io/getting-started-with-vue-form-validation-with-vee-validate-14a96fefe12d
 */

import { extend } from 'vee-validate';
import { required, min, max, numeric, confirmed, email, min_value, max_value, regex, alpha_num } from 'vee-validate/dist/rules';

extend('required', {
    ...required,
    message: '{_field_} is required'
});

extend('min', {
    ...min,
    message: '{_field_} minimum {length} character'
});

extend('max', {
    ...max,
    message: 'Please shorten the {_field_}. Maximum {length} Characters'
});

extend('numeric', {
    ...numeric,
    message: '{_field_} only allow number'
});

extend('confirmPassword', {
    ...confirmed,
    message: 'Password did not match, please try again'
});

extend('min_value', {
    ...min_value,
    message: "{_field_} can't have value less than {min}"
});

extend('max_value', {
    ...max_value,
    message: '{_field_} must be {max} or less'
});

extend('regex', {
    ...regex
});

extend('alpha_num', {
    ...alpha_num,
    message: '{_field_} may only contain alpha-numeric characters'
});

extend('regexPassword', {
    ...regex,
    message: '{_field_} must be a combination of letter character (ABC) & Number (1234)'
});

// minus value
extend('minus_value', {
    ...min_value,
    message: "{_field_} can't be less than {min}"
});

extend('email', {
    ...email,
    message: 'Email must contain “@” and ”.” in the right places'
});

extend('minPassword', {
    ...min,
    message: '{_field_} must be at least of 8 character &  max 100 , i.e : pass1234'
});

extend('maxPassword', {
    ...max,
    message: '{_field_} must be at least of 8 character &  max 100 , i.e : pass1234'
});

// Used in AddPointForm
extend('minPhoneNumber', {
    ...min,
    message: '{_field_} should be between 9 - 15 digits'
});

// Used in AddPointForm
extend('maxPhoneNumber', {
    ...max,
    message: '{_field_} should be between 9 - 15 digits'
});

// Used in Gift Code
extend('control_group_min_value', {
    ...min_value,
    message: 'Control group size must bigger than 0'
});

// Used in Gift Code
extend('control_group_max_value', {
    ...max_value,
    message: 'The maximum size for control group is {max}'
});

// Used in Gift Code
extend('maxClaimLimit', {
    ...max_value,
    message: 'Your limit claim is greater than total member selected'
});

// Used in Claim Limit
extend('minClaimId', {
    ...min,
    message: 'Claim ID must be {length} digits'
});

// Used in Claim Limit
extend('maxClaimId', {
    ...max,
    message: 'Claim ID maximum {length} digits'
});

// minimum digit
extend('min_digit', {
    ...min,
    message: '{_field_} minimum {length} digits'
});
