# Chat rooms app  - NodeJS project

## About
The project implementing a chat rooms system.

Where a user entring the join page (main page / index), by entreing his name of choice (his user nickname), and some chat room name,
can join, enter the system, and start chating.

By entering an new (non existing) chat room name the user create a new chat room,
and by choosing an existin active chat room from the dropdown the use can join an existing active chat room. 

## Basics implementation background
The backend functionality and the communication with the frotend all rely on the module socket.io.  

The frontend view, containing only two pages, implemented using simple html usage, and the dynamic rendering 
of module mustacheJs and some jQuery.
