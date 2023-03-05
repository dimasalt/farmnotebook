## Farm Notebook issues and future tasks

---

### Transaction page
 
 - Replace Chart JS with ECharts from https://echarts.apache.org/en/index.html
 

### Transaction page

- Add pagination


### Budger planning page

Need to think of possibly adding functionality to display and have multiple budgets to work with
rather than one like it's right now.


### Feed Calculator Page

- Add option to calculate a complete grain finish for 2 last months from 500lb animal to 700lb without 
    any hay for the last 60 days

- Calculator has an error when calculating total foods required. Right now it will calculate 100 lb for gain which is 3lb per day, but if anything else selected like 1 lb those calculations
    would be wrong. Needs to be fixed.


### Feeds Page

- If even there needs to get/store more information on feeds (things such as mineral components etc...), consider moving feed properties to another
    separate table with structure "name" : "value".

### Feed Requirements page
- Create a seperate controller and helper for the page. Add ability to select animal and desired ADG (average daily gain). Right now only ADG of 3lb per day is automatically selected.



### Reports Page 

Just display with good search functionlity but without ability to add or modify anything


### Contact Page 

Add pagination to the contact page. 