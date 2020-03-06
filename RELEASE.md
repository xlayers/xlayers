# XLayers release cycle

Since some time the Xlayers project has multiple sub projects to assist the code generation of several frameworks. For a easy release flow of our Xlayers app we have made some small changes to the way we release one of the sub projects. At this phase we have decided: 

1. To release our sub projects to a build repository that we will include in our app. This makes it easy to do a release of our app and apply version management on the sub projects.
2. Not to publish to NPM, our main goal with our sub projects is to have packages that are isomorphic and not coupled to the Angular framework

## List of sub projects within the Xlayer project
| Project   | Description of purpose  |
|---|---|
|sketch-ingestor   | Read the Sketch file an basic simple AST that can be used in other projects   |
| sketch-lib   | Identifys different shapes, layers and other sketch structures  |
| css-codegen   | Generation of css code based on AST  |
|svg-codegen   | Generation of SVG code based on AST   |
|xaml-codegen   | Generation of XAML code based on AST   |
|web-codegen   | Generation of web (html) code based on AST   |
| web-component-codegen   | Generation of web-components code based on AST   |
| angular-codegen  | Generation of Angular code based on AST   |
|  vue-codegen  | Generation of Vue code based on AST   |
|  stencil-codegen  | Generation of Stencil code based on AST    |
|   lit-element-codegen  | Generation of lit-element code based on AST   |
|  react-codegen  | Generation of react code based on AST   |

## How to release a sub project

The release of a sub project is easy as we have made a script that will do the hard work for you.
By running `npm run release:lib <project>` it will handle the release process.
The release process is:

1. Verify if project arguments is a sub project
2. Get the local commiter
3. Make a temp dir where the build repo will be placed in
4. Add the git repo to the temp dir
5. Run the release-it package for versioning
6. Build all dependend libraries
7. Get the commit message
8. Set the commit for the temp dir
9. Commit with the commit message
10. Push the build repo
11. Clean up
