module.exports = {
  plugins: ['stylelint-scss', 'stylelint-order'],
  extends: 'stylelint-config-standard',
  rules: {
    // recommended rules
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'scss/selector-no-redundant-nesting-selector': true,
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-order': ['width', 'height'],
    'selector-type-no-unknown': [true, { ignoreTypes: [] }],
    'selector-class-pattern': null,
  },
};
