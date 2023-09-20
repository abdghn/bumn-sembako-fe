import Vue from 'vue';
import dayjs from 'dayjs';
import numeral from 'numeral';
import _ from 'lodash';

Vue.filter('formatDate', (value) => {
    if (!value) {
        return '';
    }
    return dayjs(value).format('DD MMM YY');
});

Vue.filter('formatYearMonth', (value) => {
    if (!value) {
        return '';
    }
    return dayjs(value).format('MMM YYYY');
});

Vue.filter('formatDatetime', (value) => {
    if (!value) {
        return '';
    }
    return dayjs(value).format('DD MMM YY, HH:mm');
});

/**
 * Thousand number format
 */
Vue.filter('formatNumber', (value) => {
    if (!value) {
        return 0;
    }
    return numeral(value).format('0,0');
});

/**
 * Generate image url
 * @param {string} url
 * @returns {string}
 */
Vue.filter('imageUrl', (url) => {
    try {
        return import.meta.env.VUE_APP_IMAGE_URL + url;
    } catch (error) {
        return '';
    }
});

/**
 * Get image name
 * @param {string} url
 * @returns {string}
 */
Vue.filter('imageName', (url) => {
    try {
        const splitArray = url.split('/');
        return splitArray[splitArray.length - 1];
    } catch (error) {
        return '';
    }
});

/**
 * Convert to Capital Case
 * @param {string} text
 * @returns {string}
 */
Vue.filter('capitalCase', (text) => {
    try {
        return _.startCase(text.toLowerCase());
    } catch (error) {
        return text;
    }
});

/**
 * Campaign Status
 * @param {string} text
 * @returns {string}
 */
Vue.filter('campaignStatus', (text) => {
    try {
        const temp = _.lowerCase(text);
        return _.startCase(temp);
    } catch (error) {
        return text;
    }
});

/**
 * Campaign Status Color
 * @param {string} text
 * @returns {string}
 */
Vue.filter('campaignStatusColor', (text) => {
    try {
        const color = {
            NOT_STARTED: '#2196F3',
            ONGOING: '#66BB6A',
            EXPIRED: '#BDBDBD'
        };
        return color[text];
    } catch (error) {
        return '#BDBDBD';
    }
});

/**
 * Campaign Date Format MM/YYYY to MMM YYYY
 * @param {string} text
 * @returns {string}
 */
Vue.filter('campaignYearMonth', (value) => {
    try {
        const temp = dayjs(value, 'MM/YYYY');
        return temp.format('MMM YYYY');
    } catch (error) {
        return value;
    }
});

/**
 * voucher Status Color
 * @param {string} text
 * @returns {string}
 */
Vue.filter('voucherStatusColor', (text) => {
    try {
        const color = {
            STOPPED: '#FF5252',
            ACTIVE: '#66BB6A',
            EXPIRED: '#BDBDBD'
        };
        return color[text];
    } catch (error) {
        return '#BDBDBD';
    }
});
