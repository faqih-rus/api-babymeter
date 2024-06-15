module.exports = {
    apps: [
      {
        name: 'backend-api-babymeter',
        script: 'npm',
        args: 'run start',
        watch: true,       
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      }
    ]
  };
  