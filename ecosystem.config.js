module.exports = {
    apps: [
        {
            name: 'qq-backend',
            script: './backend/server.js',
            exec_mode: 'cluster',       // ← THIS IS THE FIX
            instances: 'max',           // ← uses all CPU cores
            env_production: {
                NODE_ENV: 'production',
                PORT: 5001,
            },
            watch: false,
            autorestart: true,
        },
         {
    name: 'qq-frontend',
    script: 'npx',
    args: ['serve', '-s', 'frontend/build', '-l', '3000'],   // ← array form, not string
    exec_mode: 'fork',
    env_production: { NODE_ENV: 'production' },
    watch: false,
    instances: 1,
    autorestart: true,
},
    ],
};
