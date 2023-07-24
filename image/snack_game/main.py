from turtle import Screen
from Snack import Snake
import time
from Food import Food
from Score_board import Score
screen = Screen()
screen.screensize(600, 600)
screen.bgcolor("black")
screen.title("Welcome to my snack game")
screen.tracer(0)


snake = Snake()
food = Food()
score_board = Score()

screen.listen()
screen.onkey(snake.up, "Up")
screen.onkey(snake.down, "Down")
screen.onkey(snake.left, "Left")
screen.onkey(snake.right, "Right")

game_on = True

while game_on:
    screen.update()
    time.sleep(0.1)
    snake.move()

    # Detecting Collision
    if snake.head.distance(food) < 15:
        food.refresh()
        snake.extend()
        score_board.increase_score()
    # Detecting Collision with wall.

    if snake.head.xcor() > 365 or snake.head.xcor() < -365 or snake.head.ycor() > 365 or snake.head.ycor() < -365:

        score_board.reset()
        snake.reset()
# Detect collision with tail.
    for segment in snake.segments[1:]:

        if snake.head.distance(segment) < 15:

            score_board.reset()
            snake.reset()

screen.exitonclick()
