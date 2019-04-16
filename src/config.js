const prod = {
    firebaseConfig: {
        apiKey: "AIzaSyCYGEoBFK6AzgE7H__FjdVUQ_vVnaEKaqA",
        authDomain: "debug-ping-preview.firebaseapp.com",
        databaseURL: "https://debug-ping-preview.firebaseio.com",
        projectId: "debug-ping-preview",
        storageBucket: "debug-ping-preview.appspot.com",
        messagingSenderId: "83999817115"
    }
};

const dev = {
    firebaseConfig: {
        "apiKey": "AIzaSyBVpeWmQ-qqxb01DhQLStvM1CagRhE1dYQ",
        "databaseURL": "https://glean-debug-view-dev-237806.firebaseio.com",
        "storageBucket": "glean-debug-view-dev-237806.appspot.com",
        "authDomain": "glean-debug-view-dev-237806.firebaseapp.com",
        "messagingSenderId": "400290159904",
        "projectId": "glean-debug-view-dev-237806"
    }
};

console.log("APP_ENV: "+process.env.REACT_APP_ENV);

const config = process.env.REACT_APP_ENV === 'prod'
    ? prod
    : dev;

export default {
    ...config
};