# Romanian budget-APP

The #Romanian Budget application is designed for Romanian users who want to track their income and expenses. Why would anyone need such an application? Because even though mobile banking application use is rising, there may be people that want to have a quick and easy way to track their cash operations/expenses.
There are three main operations a user can undertake in the #Romanian Budget application:

1.	Add a RON income
2.	Add an EUR income
3.	Add a RON expense

-	For each individual operation, the user can enter a description and an amount, which will be displayed in a table.
-	The table displays details about the different operations: the type of the operation, date, description, amount in RON and amount in EUR. The user can also delete operations.
-	By fetching data from the #Fixer API, RON values are automatically converted to EUR and vice-versa.
-	In the bottom part of the app, the user can toggle a sort button to sort the movements in a descending order.
-	The user can also select to view only operations in EUR, only operations in RON or operations in both EUR and RON. The summary in the bottom part of the app updates accordingly.
-	Today’s date and the current account balance are displayed on the top of the page. 

#NOTE
The application is deployed both on Netlify and on Surge (links below). Because the #Fixer API free subscription plan does not support SSL encryption, the site was also deployed on Surge.

Netlify: https://romanian-budget-app.netlify.app/ <br>
Surge: http://romanian-budget-app.surge.sh/

