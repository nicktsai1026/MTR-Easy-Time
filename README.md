# MTR Easy Time
### Telegram chatbot for getting Hong Kong MTR information
Telegram: @Mtr_time_bot

# Concept
In hope of providing an easy and convenient option for getting MTR information, we have the idea of creating an extension within the messenger app Telegram for providing such information. This is our prototype.

# Current information and service provided in app
1. Travel time between stations
2. Maps of destination stations
3. Bookmarking of favourite stations for easy access in the future

# How to use
1. Open bot on Telegram (@Mtr_time_bot)
2. Type `/start` or tap "Go!" to begin
3. To choose departure and destination stations, tap "Quick Check" to input the names of the stations
4. Or choose by tapping "All lines" to choose a line then a station 
5. Tap "Favourite" and sign into Facebook to bookmark favourite stations or see your bookmarked stations
6. Check map of station by tapping "Map"

# Node modules applied
1. express
2. body-parser
3. express-session
4. express-handlebars
5. axios
6. redis
7. passport

# ORM applied
1. sequelize

# Possible upgrade
1. To provide information of:
- Time of the last trains to get on in order to get to destination
- Fee
- Specific routes (where to change train)
- Show closest exits according to landmarks
2. Improve and add features
- add train line map to chatbot (to show which train line a station is on for users who don't remember)
3. Improve user interface

# Remarks
This is only the prototype of our idea and the app still has room for improvement. If you would like to help provide a better transportation information app for people in Hong Kong, we encourage you send us feedback, build on our code and let us know about it :)

# Authors
Corah Chiu (git:corahchiu), Nick Tsai (git:nicktsai1026), Morris Wong (git:morriswong)

# Credits
Thank you Gordon Lau (git:gordonlau) and Thilo Roth (git:thiloo) for your infinite support and help with our project.
