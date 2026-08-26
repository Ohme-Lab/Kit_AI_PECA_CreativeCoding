# Reliability
Le but de cette partie du travail est de rendre l'application fiable pour pouvoir avancer sur l'écriture des niveaux. 
A l'heure actuelle l'application possède des manquements plutôt important pour le bon déroulement du reste du développement. En reprenant les choses dans le todo, les choses les plus urgentes sont :
- Permettre l'écriture de petits tutos entre les niveaux à l'aide d'une popup window
- Affirmer le fonctionnement de l'app et la dynamique de jeu (les checks, la fausse génération de code IA et les bugs, pour l'instant on réécrit tout le code, notamment le premier fonctionnement de notre bouton "debug")
- Rendre les checks de code fiables, donner une manière de les écrire assez simple
- Le fait que les erreurs affichées du code soient les erreurs réelle (ligne de code correcte, erreur liée au code issue de codemirror)

Ensuite des choses moins urgentes mais qui ajoutent de la fonctionnalité : 
- Griser le code déjà fixé ou les blocs déjà fixés
- Mettre en place un système de hint (soft hints into big hints ? un clippy par exemple)
