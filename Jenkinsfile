//pipeline {
//    agent any

    //stages {
      //  stage('Test') {
        //    steps {
          //      echo 'GitHub webhook is working!'
            //    sh 'hostname'
              //  sh 'date'
          //  }
      //  }
   // }
//}

pipeline {
    agent any

    // -------------------------------------------------------------------------
    // PARAMETERS
    // -------------------------------------------------------------------------
    parameters {
        string(name: 'APP_NAME', defaultValue: 'express_app', description: 'Name of the Express app & PM2 process')
        string(name: 'KEEP_RELEASES', defaultValue: '5', description: 'Number of historical releases to keep on disk')
    }

    // -------------------------------------------------------------------------
    // ENVIRONMENT CONFIGURATION
    // Credentials and local target directory definitions
    // -------------------------------------------------------------------------
    environment {
        // Jenkins Secret File Credential ID containing the production .env file
        ENV_SECRET_ID  = "express-${params.APP_NAME}-env-prod"

        // Base Paths on the local VM
        TARGET_APP_ROOT = "/home/pbx/komm/load_balancer/express/${params.APP_NAME}"
        RELEASES_DIR    = "/home/pbx/komm/releases/express/${params.APP_NAME}"
        RELEASE_PATH    = "${env.RELEASES_DIR}/${BUILD_NUMBER}"
    }

    stages {
        
        // =====================================================================
        // STAGE 1: BUILD & PREPARE LOCAL ARTIFACTS
        // =====================================================================
        stage('Install & Build') {
            steps {
                echo "=========================================================="
                echo "[INFO] Building Node.js Application '${params.APP_NAME}' (Build #${BUILD_NUMBER})"
                echo "=========================================================="
                
                // Clean install dependencies and run build script (e.g., tsc or esbuild)
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        // =====================================================================
        // STAGE 2: RELEASE & DEPLOYMENT
        // =====================================================================
        stage('Deploy Local Release') {
            steps {
                echo "[INFO] Creating release directory at: ${env.RELEASE_PATH}"
                
                // 1. Create target release and load balancer directories if they don't exist
                sh "mkdir -p ${env.RELEASE_PATH} ${env.TARGET_APP_ROOT}"

                // 2. Copy compiled build files to the local release directory
                echo "[INFO] Copying compiled files to release directory..."
                sh "cp -r build/* ${env.RELEASE_PATH}/"

                // 3. Inject production .env file from Jenkins Credentials Store
                echo "[INFO] Injecting .env.prod file..."
                withCredentials([file(credentialsId: env.ENV_SECRET_ID, variable: 'PROD_ENV_FILE')]) {
                    sh "cp \$PROD_ENV_FILE ${env.TARGET_APP_ROOT}/.env.prod"
                }

                // 4. Atomically switch the 'build' symlink to point to the new build folder
                echo "[INFO] Atomically updating symlink: ${env.TARGET_APP_ROOT}/build -> ${env.RELEASE_PATH}"
                sh "ln -sfn ${env.RELEASE_PATH} ${env.TARGET_APP_ROOT}/build"
            }
        }

        // =====================================================================
        // STAGE 3: PM2 PROCESS RELOAD & CLEANUP
        // =====================================================================
        stage('Reload PM2 & Cleanup') {
            steps {
                echo "[INFO] Reloading PM2 process '${params.APP_NAME}'..."
                
                // Reload process with zero downtime, or start it if it isn't running yet
                sh """
                    cd ${env.TARGET_APP_ROOT}
                    pm2 reload ${params.APP_NAME} --env production || pm2 start build/index.js --name ${params.APP_NAME} --env production
                """

                // Clean up old builds (retains the latest N releases)
                echo "[INFO] Cleaning up older releases (keeping latest ${params.KEEP_RELEASES})..."
                sh """
                    cd ${env.RELEASES_DIR} && ls -dt */ | tail -n +\$((${params.KEEP_RELEASES} + 1)) | xargs -I {} rm -rf {}
                """
            }
        }
    }

    // -------------------------------------------------------------------------
    // POST EXECUTION LOGS
    // -------------------------------------------------------------------------
    post {
        success {
            echo "=========================================================="
            echo "[SUCCESS] Build #${BUILD_NUMBER} deployed successfully!"
            echo "Active build symlink: ${env.TARGET_APP_ROOT}/build"
            echo "=========================================================="
        }
        failure {
            echo "=========================================================="
            echo "[FAILURE] Deployment failed! Check the step logs above."
            echo "=========================================================="
        }
    }
}