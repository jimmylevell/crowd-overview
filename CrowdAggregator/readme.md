# Measurement Aggregator - Azure Function - TimerTrigger - JavaScript
Azure Function which is triggered periodically. The function connects to the mongoDb and gets all current measurements uploaded by the checkpoints. These measurements are then grouped into timeslots and aggregated. The aggregated information are stored back to the database as the individual measurements are purged.

## Configuration
Crontab: every 5 min
