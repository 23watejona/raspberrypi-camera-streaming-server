# Installation Instructions:
1. Image a microsd with raspbian desktop
   * I recommend using the raspberry pi imaging tool
2. Go through the setup 
   * Make sure the username is "pi".
3. On a computer that has the files, open git bash. 
   * If git bash isn't installed, go [here](https://git-scm.com/downloads)
   * If rsync isn't installed in git bash, go [here](https://ayewo.com/how-to-install-rsync-on-windows/)
4. Navigate to the directory that has the files
   * `cd {path to file directory}`
5. Copy the files from the host computer to the raspberry pi
   * `rsync -avr . pi@{ip address of the pi}:/home/pi/webserver`
6. On the pi again, sync the clock to the correct time
   * `sudo date -s "{current date and time in the format "Month Name day HH:MM:SS"}"`
7. Install nodejs
   * `sudo apt install nodejs`
8. Symlink the service file into the systemd system files directory
   * `sudo ln -s /home/pi/werbserver/webserver.service /etc/systemd/system`
9. Enable the service so it runs on startup
   * `sudo systemctl enable webserver`