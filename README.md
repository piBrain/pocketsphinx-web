# Overview

Pocketsphinx-Web is a an opinionated high-level wrapper for the [PocketSphinx.js speech recognizer](https://github.com/syl22-00/pocketsphinx.js).
It provides a convenient, promise-based API for loading pocketsphinx in a web-worker.


## Installing

[NPM](https://npmjs.org) users can install using:

```
npm install pocketsphinx-web
```


Alternatively, you can use a script tag to load pocketsphinx. The api will be available under the object```window.Sphinx```.


## Building

Pocketsphinx-Web is built using webpack. This handles dynamic resolution of worker files and makes including this project in other work much simpler.

```
yarn install install required packages from the package.json

yarn build-dev - This builds the dev version and stores the bundle under /dev

yarn build - This builds a minified production version of the code with source maps in the /dist folder.
```


## Examples

Web-workers can't be run directly from the filesystem, so to run the examples you will need to create a webserver.
You can start one using ```yarn example```, then load the example at ```localhost:9000```.
This will also watch for changes to any files and automatically update them for the running example.

## Resources

Below are more resources for pocketsphinx and speech recognition in general.
* [PocketSphinx.js speech recognizer](https://github.com/syl22-00/pocketsphinx.js)
* [PocketSphinx](http://cmusphinx.sourceforge.net/)
* [CMU Pronunciation Dictionary site](http://www.speech.cs.cmu.edu/cgi-bin/cmudict)
* [CMUSphinx Tutorial](http://cmusphinx.sourceforge.net/wiki/tutorial)
