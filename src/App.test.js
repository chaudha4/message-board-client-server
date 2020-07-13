import React from 'react';

import { render, screen, waitForDomChange } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';


// https://www.robinwieruch.de/react-testing-library
// https://github.com/testing-library/user-event#clickelement-eventinit-options


describe('App', () => {
  test('renders App component', () => {
    render(<App />);
    //screen.debug(); // This will print the html output of Splash Screen
  });

  test('Verify Splash Screen goes away', async () => {
    render(<App />);

    // wait for message board to render. The "findBy" search variant is used 
    // for asynchronous elements which will be there eventually. 
    await screen.findByText(/Message Board/)


    // Use queryBy or getBy variants for sync requests.
    expect(screen.queryByText(/Board Name:/)).toBeInTheDocument();

    // This will print the html output of Message Board
    //screen.debug(); 

    // Dump all roles
    //screen.getByRole('');

    // Now verify buttons
    //const buttons = await screen.findAllByRole('button');
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);

    // Now verify Textbox
    //const tbs = await screen.findAllByRole('textbox');
    const tbs = screen.getAllByRole('textbox');
    expect(tbs).toHaveLength(1);
    
    // Set board name to abcdefgh;
    userEvent.type(screen.getByRole('textbox'), 'abcdefgh')
    
    // Simulate a click on Create Button
    userEvent.click(screen.getByText('Create'));

    //Wait for the results - Every new board is created with this text in thread.
    await screen.findByText('New Thread - Please update');

    screen.debug(); // This will print the html output of Message Board

    // Simulate a click on Delete Button
    userEvent.click(screen.getByText('Delete'));

        // Sleep for 5 secs
        await waitForDomChange( () => { 
          setTimeout( () => {
            setLoading(false);
          }, 5000)
        });

    screen.debug(); // This will print the html output of Message Board
    //screen.getByRole('');

  });
  
});


