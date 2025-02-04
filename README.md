# Nonogram Board Solver

The app lets you create your own Nonogram board and solves it for you with steps.
This project is a remake of my highschool project written in Typescript, React with Electron.

## Whats in this app?

The app lets you draw and customize your own board with some utilities:


- Manipulating board size to your choice.

<img src="./public/videos/size.gif" width=400/> 
<br/>

- Rotating the board 90 degrees either side.
- Flipping the board horizontally and vertically.

<img src="./public/videos/creation.gif" width=400/>
<br/>

- Creating random boards with optional black percentage slider.

<img src="./public/videos/random.gif" width=400/>
<br/>

The app makes its own constraints while customizing your board.

- Another option is to edit the constraints manually, which can help you solve unknown boards!

When you are done creating, you can let computer solve the board by using its constraints.

## So, how does it solve?

The algorithm used to solve the board is a backtracking algorithm. I researched the web and combined some of what I found and modified it.

### STEP #1 - getting all the solutions for the rows in the board

This is my first modification:

Instead of starting to solve immediately and checking each tile of the board,
the algorithm creates a multi-dimensional array which contains all of the possible solutions for every row.
Each row may have more than 1 solution by itself.

The solutions are created by using only the rows constraints.

### STEP #2 - going through all the possible solutions to complete a board

What's left to do is iterate over all the row solutions which were found, and complete a board by checking the column constraints.

The algorithm used is Back-tracking. Every step adds a new row solution to the current board. If successfully, adds another, otherwise it will back-track to the old board, until the board is complete.

<img src="./public/videos/solve.gif" width=400/>


### How are the steps saved?

- The main function of the algorithm creates a snapshot of the board each time a row is added.
- If the row is a success, it adds it a steps array which is displayed later.

However, this got me to some trouble - **THERE WERE SO MANY STEPS**

With a large board, a solution can have more than **10,000,000 steps**.

I had to manage the snapshot to use the lowest amount of memory. Then, I found **BIT ARRAYS** as a solution.

Because Nonogram boards have only 2 colors, a bit array is a super efficient data structure to save a snapshot of the grid.

This extremely reduced the amount of memory used to solve the large boards.