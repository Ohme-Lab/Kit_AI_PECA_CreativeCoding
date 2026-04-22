first ask AI plutôt OK, juste comment passer d’un level à un autre (prompt win, cliquer sur la fenêtre win ?)
second ask AI, il faut que ça passe au niveau debug directement. 
Comment organiser les timeouts pour capter que l’on passe d"un level à un autre ? Cliquer sur la fenêtre win pour le next ? 

## Animations, feel et interface
Le WIP à finir pour les animations c’était :
- boutons play pause etc, 
- la progress bar, un truc qui montre les levels et les steps de manière plus claire. 
- une fenêtre win un peu meilleure, peut être un truc flottant, une fenêtre à dismiss avant de passer au step suivant. 
- les différents panes resizable. 
- une fenêtre indice en bas du pane du code. Un espèce de clippy ? Un petit sprite qui vient t’aider quand t’es en galère. Regarder ce qui se fait en terme de game design. *Demander à mon poto Lazlo Bougart ?* 

___ 

## AI gamble
**Idée** : plus tu demandes des trucs compliqués, plus ça rajoute des bugs dans le code. Idée de "*gambling*"
Tâche facile -> ez, ça rajoute 3 lignes
Tâche middle -> petits bugs
Tâche "fait tout" -> soit magique et ça marche, soit ça casse vraiment tout en mode inutilisable

Donc l’ia c’est plus magique, ça redevient un outil, plus tu demandes des gros changements que tu comprends pas, où toi tu fais "rien", plus c’est relou à utiliser. Ou justement en fonction de ta maitrise technique, ça pourrait valoir la peine de l’utiliser -> retour à l’aspect compétence

En pratique : 3 forces de "Ask-AI" avec du coup un pourcentage de chance que ça foute la merde, avec l’option la plus extrême qui pourrait soit complétement résoudre le niveau, soit tout casser, quitte à recommencer le niveau. 

**Morale** : L’ia c’est un outil qui s’ajoute merveilleusement bien à des compétences réelles 

## En pratique 
Plusieurs trucs à implémenter : 
- avoir une bibliothèque de bugs, une manière de savoir ce que ça va envoyer, de pouvoir hint l’utilisateur sur ces bugs
- Un bouton "go back" en cas de catastrophe
- Une manière de tracker les bugs que les gens rajouteraient en modifiant des mauvais trucs, potentiellement en les empêchant de modifier certaines lignes (que ça soit en soft, donc direct prompter ‘hep hep hep c’est pas ça’ ou carrément en bloquant la modif sur une mauvaise ligne)

## Feedback Camillia 
Drag and drop pas évident quand on ne connait pas du tout l'outil. 

## Random TODO
Checker la propreté des checks. 