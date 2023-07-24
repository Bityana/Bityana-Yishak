
# print report.

from recipe import MENU, resources
coffee_machine = True
water_left1 = 0
coffee_left1 = 0
milk_left1 = 0
# Ask user to choice until resource is out
while coffee_machine:
    guess_choice = input("What would you like? (espresso/latte/cappuccino): ").lower()
    coffee = MENU[guess_choice]["ingredients"]["coffee"] + coffee_left1
    resource_water = resources['water']
    resource_coffee = resources['coffee']
    water = MENU[guess_choice]["ingredients"]["water"] + water_left1
    water_left = resource_water - water
    coffee_left = resource_coffee - coffee
    # check the resource left before asking for money.
    if water_left >= 0 and coffee_left >= 0:
        print(f'The price for {guess_choice} is {MENU[guess_choice]["cost"]}$')
        print("Please insert coins How many quarters?")
        quarters = float(input("How many quarters?: "))
        dimes = float(input("How many dimes?: "))
        '''dimes is 10 cent'''
        nickles = float(input("How many nickles?: "))
        '''nickel is equal to five cents'''
        pennies = float(input("How many pennies?: "))
        '''penny is one cent'''
        cost = MENU[guess_choice]["cost"]
        total = (quarters * 25) + (dimes * 10) + (nickles * 5) + pennies - (cost * 100)
        customer_money = ((quarters * 25) + (dimes * 10) + (nickles * 5) + pennies) / 100
        change = total / 100
        coffee_left1 += coffee
        water_left1 += water
        # Check and give for user change
        if total >= 0:
            # check the user choice is not espresso
            if guess_choice != "espresso":
                resource_milk = resources['milk']
                milk = MENU[guess_choice]["ingredients"]["milk"] + milk_left1
                milk_left = resource_milk - milk
                if milk_left >= 0:
                    milk_left1 += milk
                    print(f'Here is ${change} in change.\nHere is your {guess_choice} ☕.')
                else:
                    print("Sorry we are out of resources to make your order")
                    coffee_machine = False
            else:
                print(f'Here is ${change} in change.\nHere is your {guess_choice} ☕.')

        else:
            print(f"The money is not enough. Here is your fund. ${customer_money}")

    else:
        print("Sorry we are out of resources to make your order")
        coffee_machine = False
