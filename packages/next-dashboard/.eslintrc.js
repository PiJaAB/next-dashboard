const path = require('path');

module.exports = {
    extends: [
      'airbnb',
      'plugin:flowtype/recommended',
      'plugin:prettier/recommended',
      'prettier',
      'prettier/flowtype',
      'prettier/react'
    ],
    plugins: [
      'react',
      'jsx-a11y',
      'import',
      'flowtype'
    ],
    parser: "babel-eslint",
    parserOptions: {
      ecmaVersion: 6
    },
    rules: {
      'class-methods-use-this': [ 'off' ],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-underscore-dangle': ['error', { allow: ['_id', '__typename'] }],
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', 'argsIgnorePattern': '^_', ignoreRestSiblings: true }],
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
      'react/jsx-one-expression-per-line': [ 'off' ],
      'jsx-a11y/label-has-for': [ 'error', {
        required: {
          some: [ 'nesting', 'id'  ]
        }
      }],
      'jsx-a11y/label-has-associated-control': [ 'off' ],
      'jsx-a11y/media-has-caption': [ 'off' ],
      'import/no-extraneous-dependencies': [
        'error', {
          devDependencies: ['**/*.test.js', 'storybook/**/*.js'],
          packageDir: path.join(__dirname)
        }
      ],
      'react/forbid-prop-types': ['off', { forbid: [] }],
      'jsx-a11y/anchor-is-valid': ['off'],
      'spaced-comment': ['off'],
      'react/prefer-stateless-function': ['error', { ignorePureComponents: true }],
      'react/default-props-match-prop-types': ['off'],
      'flowtype/array-style-complex-type': ['error', 'shorthand'],
      'flowtype/array-style-simple-type': ['error', 'shorthand'],
      'flowtype/no-dupe-keys': ['error'],
      'flowtype/no-flow-fix-me-comments': ['warn', 'workaround'],
      'flowtype/no-primitive-constructor-types': ['error'],
      'flowtype/no-types-missing-file-annotation': ['error'],
      'flowtype/no-unused-expressions': ['error'],
      'flowtype/no-weak-types': ['warn'],
      'flowtype/require-exact-type': ['off'],
      'flowtype/require-parameter-type': ['error', { excludeArrowFunctions: true }],
      'flowtype/require-return-type': ['error', 'always', {
        excludeArrowFunctions: true,
        excludeMatching: [ 'render' ]
      }],
      'flowtype/require-types-at-top': ['off'],
      'flowtype/require-valid-file-annotation': ['error', 'always'],
      'flowtype/require-variable-types': ['off'],
      'flowtype/sort-keys': ['off'],
      'flowtype/type-id-match': ['error', '^[A-Z]'],
      'flowtype/type-import-style': ['off'],
      'flowtype/use-flow-type': ['off'],
      'no-console': [ 'off' ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
        },
        {
          selector: 'ForOfStatement',
          message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
        },
        {
            "selector": ":not(IfStatement[test.operator='==='][test.right.type='Literal'][test.right.value='development'][test.left.type='MemberExpression'][test.left.object.type='MemberExpression'][test.left.object.property.type='Identifier'][test.left.object.property.name='env'][test.left.object.object.type='Identifier'][test.left.object.object.name='process'][test.left.property.type='Identifier'][test.left.property.name='NODE_ENV'] > BlockStatement > ExpressionStatement) > CallExpression[callee.object.name='console']",
            "message": "Unexpected property on console object was called while not being directly in a development if-statement block."
        }
      ]
    },
    env: {
      jest: true,
      browser: true
    },
    globals: {
      document: false,
      window: false,
      fetch: false,
      catch: false
    }
  }
