  Fichiers créés                                                                                             
  ┌─────────────────────────────┬───────────────────────────────────────────────┐                            
  │           Fichier           │                  Description                  │                            
  ├─────────────────────────────┼───────────────────────────────────────────────┤                            
  │ Dockerfile                  │ Image Docker multi-stage (build + production) │                            
  ├─────────────────────────────┼───────────────────────────────────────────────┤                            
  │ .dockerignore               │ Exclut les fichiers inutiles de l'image       │                            
  ├─────────────────────────────┼───────────────────────────────────────────────┤                            
  │ docker-compose.yml          │ Orchestration locale (API + PostgreSQL)       │                            
  ├─────────────────────────────┼───────────────────────────────────────────────┤                            
  │ render.yaml                 │ Blueprint Render pour déploiement automatique │                            
  ├─────────────────────────────┼───────────────────────────────────────────────┤                            
  │ .github/workflows/ci-cd.yml │ Pipeline CI/CD GitHub Actions                 │                            
  └─────────────────────────────┴───────────────────────────────────────────────┘                            
  Utilisation locale                                                                                         
                                                                                                             
  # Construire et lancer avec Docker Compose                                                                 
  docker-compose up --build                                                                                  
                                                                                                             
  # Ou construire l'image seule                                                                              
  docker build -t bem-planning-api .                                                                         
                                                                                                             
  Déploiement sur Render                                                                                     
                                                                                                             
  Option 1 : Blueprint (recommandé)                                                                          
                                                                                                             
  1. Connectez votre repo GitHub à Render                                                                    
  2. Allez sur https://dashboard.render.com/blueprints                                                       
  3. Cliquez New Blueprint Instance                                                                          
  4. Sélectionnez votre repo → Render détectera render.yaml                                                  
  5. Configurez les variables d'environnement marquées sync: false                                           
                                                                                                             
  Option 2 : Déploiement manuel                                                                              
                                                                                                             
  1. Créez un Web Service sur Render                                                                         
  2. Sélectionnez Docker comme runtime                                                                       
  3. Créez une PostgreSQL database                                                                           
  4. Liez la base de données via DATABASE_URL                                                                
                                                                                                             
  Configuration GitHub Actions                                                                               
                                                                                                             
  Ajoutez ces secrets dans votre repo GitHub (Settings → Secrets → Actions) :                                
  ┌───────────────────┬─────────────────────────────────────────────────┐                                    
  │      Secret       │                   Description                   │                                    
  ├───────────────────┼─────────────────────────────────────────────────┤                                    
  │ RENDER_API_KEY    │ Clé API Render (Account Settings → API Keys)    │                                    
  ├───────────────────┼─────────────────────────────────────────────────┤                                    
  │ RENDER_SERVICE_ID │ ID du service (visible dans l'URL du dashboard) │                                    
  └───────────────────┴─────────────────────────────────────────────────┘                                    
  Le pipeline s'exécutera automatiquement sur chaque push vers main ou develop. 


  sudo docker build --network=host -t bem-planning-api .
  https://bem-planning-fc-backend-latest.onrender.com/api/docs#/users/UsersController_findAll