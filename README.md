# Moodli

Moodli is an open-source mood tracking program.

## Installation
### Method 1: Using the Docker Hub repository
Install [docker](https://www.docker.com/) on your machine.

Run the following command:
```bash
docker run -p 80:80 --name moodli-container --restart unless-stopped -d nadavtasher/moodli:latest
```
### Method 2: Building a docker image from source
Install [docker](https://www.docker.com/) on your machine.

[Clone the repository](https://github.com/NadavTasher/Moodli/archive/master.zip) or [download the latest release](https://github.com/NadavTasher/Moodli/releases/latest), enter the extracted directory, then run the following commands:
```bash
docker build . -t moodli
docker run -p 80:80 --name moodli-container --restart unless-stopped -d moodli
```

## Usage
Open `http://address` on a computer or a phone.

## Contributing
Pull requests are welcome, but only for smaller changer.
For larger changes, open an issue so that we could discuss the change.

Bug reports and vulnerabilities are welcome too. 
## Licenses
Moodli - [MIT](https://choosealicense.com/licenses/mit/)

JetBrains Mono - [Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)

Twemoji - [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)