# csv-clean-assistant

## Project setup
### Prerequisites
**recommended:** install [yarn](https://yarnpkg.com/lang/fr/docs/install/) globally
### Project initialization
```
yarn install
```
### Compiles and hot-reloads for development
```
yarn run electron:serve 
```
To run with the remote debugger (for background process):
```
yarn run electron:debug
```
### Compiles and minifies for production
```
yarn run electron:build
```
### Lints and fixes files
```
yarn run lint
```

## informations about development and project architecture
This project uses webpack to compile the code and eslint (standard settings) to keep it tidy.
The project's source code is stored in the src/ folder and is structured as follows:
```
src/
-+ assets/ # folder to store static assets
-+ background-process/ # folder for js modules destined for the background process
-+ components/    # all Vue components (components, not templates) will be stored here
---+ atomic-ui/     # all the components inside this folder are registered globally and accessible in any other component without explicit declaration
-----+ atoms/         # smallest unit, no logic except for some event emitting (don't call the $store!)
-----+ molecules/     # more complex unit (often composed of atom components). Still no logic
-----+ wrappers/      # not an atomic concept. Those components' purpose is to "dress" their content with some extra markup.
---+ ui-toolbox/    # Utility components may contain logic but shouldn't depend on the $store
---- …              # Other components are stored at the root of the components/ folder. They should make use of the $store
-+ global-scss/   # this folder contains the scss source files that should be applied to all the app
-+ helpers/       # helper functions that should be available on either back or front process (have to be explicitly imported)
-+ store/modules/ # VueX store folder. Each file describes a separate store and the associated methods. Each store has a specif purpose (handle csv analyzis, user settings, …)
-+ views/         # The components declared in this folder are meant to be called with the $router plugin
-+ App.vue        # root Vue component
-+ background.js  # JS file that initiate the background process
-+ main.js        # JS file that initiate the front process (renderer)
-+ router.js      # defines the app's routes (= screens)
```
