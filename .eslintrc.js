module.exports = {
    parser: 'babel-eslint',
    extends: ['airbnb-base', 'react-app', 'plugin:sonarjs/recommended', 'plugin:import/errors', 'prettier'],
    env: {
        jest: true,
    },
    plugins: ['import', 'sonarjs'],
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'max-len': ['error', 120],
        'no-underscore-dangle': ['error'],
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'no-mixed-operators': 'off',
        'no-await-in-loop': 'off',
        'func-names': ['error', 'never'],
        'prefer-destructuring': [
            'error',
            {
                VariableDeclarator: {
                    array: false,
                    object: true,
                },
                AssignmentExpression: {
                    array: true,
                    object: false,
                },
            },
            {
                enforceForRenamedProperties: false,
            },
        ],
        'import/prefer-default-export': 'off',
        'import/no-named-as-default': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            { devDependencies: ['**/*.test.js', '**/*.spec.js', '**/test/*.js', '**/__tests__/*.js'] },
        ],
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-small-switch': 'off',
        'no-param-reassign': 'off',
        'class-methods-use-this': 'off',
        'no-shadow': 'off',
        'spaced-comment': ['error', 'always'],
    },
};
