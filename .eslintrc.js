module.exports = {
    "env": {
        "node": true,
        "es6" : true,
        "browser" : true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars" : [
            0
        ],
        "no-trailing-spaces" : [
            "warn"
        ],
        "no-extra-semi" : [
            "error"
        ],
        "no-console" : [
            0
        ],
        "semi-spacing" : [
            "error",
            {"before": false, "after": true}
        ]
    },
    "globals" : {
        "_posts" : false
    }
};
