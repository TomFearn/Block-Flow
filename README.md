# Tetris Hackathon Project

#### Try it out here: 

#### Team members:

## Contents

1. [Overview](#overview)
2. [Project Planning](#project-planning)
3. [Project Development](#project-development)
4. [Project Deployment](#project-deployment)
5. [Testing](#testing)
6. [Impact of AI](#impact-of-ai)
7. [Sources](#sources)


## Overview

This is our version of Classic Tetris. We made this for our first Hackathon project of our Code Insitute course.
Using frontend technologies we chose to make a game out of the options provided. The project consists of one HTML file,
one JavaScript file, a stylesheet and a readME. Furthermore, we implemented the bootstrap framework to position the index.html
contents for the webpage.

#### What is tetris?

Tetris is a classic arcade game where the player is given randomly selected blocks that move down the screen. Each block is made of 4 cells and can be moved left, right, or down, and rotated. A block stops moving when one of its cells contacts another cell in the game area. The player scores points by filling a row with cells. When a row is filled, it is cleared, and the cells above move down, increasing the player's score. The game continues until there is no room to add new shapes. The player's score is then compared to the high score, which is updated if the player's score is higher.

## Project Planning

#### Our final project board:
#### Our initial miro board: [Tetris miro board](https://miro.com/app/board/uXjVL_bgpm8=/)

### User Stories



## Project Development

### Our Approach

### Key Successes

### Challenges we Faced


## Project Deployment

To deploy our tetris game we used GitHub pages which is a free platform to host webpages. We deployed as early as possible and we first published when we had our MVP (minimum viable product).

## Testing


## Impact of AI

### What AI tools did we use?

We used the GitHub co-pilot extension mainly using the chat window but also the in-line prompting.

### What did we use it for?

We used AI for debugging adn to explain any bugs and suggest possible fixes to these issues.

#### An Example of this:
 
>__Bug__: we had a bug where the game loop would throw an error when the block reached the bottom of the play area.
>
>__Co-pilot Explanation__: the function used for checking for indexes that were out of range
>
>__Actions taken__: Co-pilot also suggested a quick one line fix to check that the index was within the correct range and once it had explained the code to us it was implemented.

We were also able to use the chat feature to explain code that others had written to get a faster understanding of our current progress in the project and to ensure that any features added were compatible with the other features the team had implemented.


## Sources

- [__Bootstrap Docs__](https://getbootstrap.com/docs/4.1/getting-started/introduction/)
- [__GitHub co-pilot__](https://github.com/features/copilot)
