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
        PATH = "/root/.nvm/versions/node/v22.21.1/bin:${env.PATH}"
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
                
                // Change directory to the specific service folder (e.g., crm_api or kservices_ts_api)
                dir("${params.APP_NAME}") {
                    echo "[INFO] Current working directory: ${pwd()}"
                    
                    sh 'node -v'
                    sh 'npm -v'
                    //sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        // =====================================================================
        // STAGE 2: RELEASE & DEPLOYMENT
        // =====================================================================
        stage('Deploy Local Release') {
            steps {
                echo "[INFO] Creating release directory at: ${env.RELEASE_PATH}"
                
                // 1. Create target release and load balancer directories
                sh "mkdir -p ${env.RELEASE_PATH} ${env.TARGET_APP_ROOT}"

                // 2. Copy compiled files from the sub-folder build directory
                echo "[INFO] Copying compiled files to release directory..."
                dir("${params.APP_NAME}") {
                    sh "cp -r build/* ${env.RELEASE_PATH}/"
                }

                // 3. Atomically switch the 'build' symlink to point to the new build folder
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
                
                sh """
                    cd ${env.TARGET_APP_ROOT}

                    if pm2 list | grep -qw "${params.APP_NAME}"; then
                        echo "[INFO] Reloading existing process..."
                        pm2 reload ${params.APP_NAME} --update-env
                    else
                        echo "[INFO] Starting new process..."
                        pm2 start build/index.js --name ${params.APP_NAME} --node-args="-r dotenv/config" -- dotenv_config_path=.env.prod
                    fi

                    sleep 2

                    if pm2 list | grep "${params.APP_NAME}" | grep -q "online"; then
                        echo "[SUCCESS] ${params.APP_NAME} is running!"
                    else
                        echo "[ERROR] ${params.APP_NAME} failed to stay online!"
                        exit 1
                    fi
                """

                // Clean up old builds (retains latest N releases)
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