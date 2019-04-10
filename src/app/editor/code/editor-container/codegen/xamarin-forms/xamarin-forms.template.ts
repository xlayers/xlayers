export const readmeTemplate = () => {
    const codeBlock = '```';
    return `
## How to use the Xlayers Web Components built with Xamarin.forms

${codeBlock}
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
${codeBlock}
  `;
};

export const mainPageTemplate = `
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:xLayers"
             xmlns:ff="clr-namespace:FFImageLoading.Forms;assembly=FFImageLoading.Forms"
             xmlns:ffSvg="clr-namespace:FFImageLoading.Svg.Forms;assembly=FFImageLoading.Svg.Forms"
             x:Class="xLayers.MainPage">
  <AbsoluteLayout>
{xamlContent}
  </AbsoluteLayout>
</ContentPage>`;
