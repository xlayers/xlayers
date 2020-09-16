import { Injectable } from '@angular/core';
import { XamarinFormsCodeGenVisitor } from '@xlayers/xaml-codegen';
import { SketchMSLayer } from '@xlayers/sketchtypes';

/**
 * @see CodeGenFacade implementation able to generate Xamarin.Forms code
 */
@Injectable({
  providedIn: 'root',
})
export class XamarinCodeGenService {
  constructor(private readonly codegen: XamarinFormsCodeGenVisitor) {}

  buttons() {
    return {
      stackblitz: false,
    };
  }

  generate(ast: SketchMSLayer) {
    return [
      {
        uri: 'README.md',
        value: this.renderReadme(),
        language: 'markdown',
        kind: 'text',
      },
      {
        uri: 'MainPage.xaml',
        value: this.renderComponent(ast),
        language: 'xaml',
        kind: 'xamarinForms',
      },
      ...this.codegen.consumeFileList(),
    ];
  }

  private renderReadme() {
    return `
## How to use the Xlayers Web Components built with Xamarin.forms

\`\`\`
  Xlayers for Xamarin.forms use the FFImageLoading library
  to load images and svg content quickly and easily

  1 - Download and install nugget packages
      - Xamarin.Forms
      - Xamarin.FFImageLoading
      - Xamarin.FFImageLoading.Forms
      - Xamarin.FFImageLoading.Svg
      - Xamarin.FFImageLoading.Svg.Forms

  2 - Import the MainPage.xaml file into your main project
      and rename the namespace to fit your project

  3 - Import the *.svg and images into your shared project
      Set the build action of the files to 'Embedded resource'
      Set the right namespace and path to files in ffSvg elements source in the MainPage.xaml

  4 - Initialise the FFImageLoading library in your platform specific projects
      after initialising components

        IOS : in AppDelegate.cs
          Call  FFImageLoading.Forms.Platform.CachedImageRenderer.Init()
          after global::Xamarin.Forms.Forms.Init()
          in    AppDelegate.FinishedLaunching()

        UWP : in MainPage.xaml.cs
          Call  FFImageLoading.Forms.Platform.CachedImageRenderer.Init()
          after global::Xamarin.Forms.Forms.Init()
          in    MainPage.MainPage()

        Android : in MainPage.xaml.cs
          Call  FFImageLoading.Forms.Platform.CachedImageRenderer.Init(true)
          after global::Xamarin.Forms.Forms.Init()
          in    MainActivity.OnCreate()
\`\`\``;
  }

  private renderComponent(ast: SketchMSLayer) {
    return `
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:xLayers"
             xmlns:ff="clr-namespace:FFImageLoading.Forms;assembly=FFImageLoading.Forms"
             xmlns:ffSvg="clr-namespace:FFImageLoading.Svg.Forms;assembly=FFImageLoading.Svg.Forms"
             x:Class="xLayers.MainPage">
  <AbsoluteLayout>
${this.codegen.generateTemplate(ast)}
  </AbsoluteLayout>
</ContentPage>`;
  }
}
