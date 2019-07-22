import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'xly-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  version = environment.version;

  viewerSections = [
    {
      frame: {
        width: '340px',
        left: '400px',
        top: '54px',
        height: '50px'
      },
      tooltip: {
        direction: 'right',
        left: '90px',
        top: '20px'
      },
      button: {
        top: '70px',
        left: '375px'
      },
      description:
      'Quick access to layers inspection, zooming functionalities and 3D mode, with the addition of the codegen editor (see below for more details).'
    },
    {
      frame: {
        width: '200px',
        left: '0px',
        top: '120px',
        height: '640px'
      },
      tooltip: {
        direction: 'left',
        left: '155px',
        top: '338px'
      },
      button: {
        top: '370px',
        left: '80px'
      },
      description:
        'Quickly access and inspect the layers hierarchy of the Sketch design.'
    },
    {
      frame: {
        width: '730px',
        left: '203px',
        top: '110px',
        height: '650px'
      },
      tooltip: {
        direction: 'right',
        left: '270px',
        top: '367px'
      },
      button: {
        top: '410px',
        left: '592px'
      },
      description:
        'A fully fledged design viewer with both 2D and 3D inspection mode allowing you to access all the layers of your design.'
    },
    {
      frame: {
        width: '180px',
        left: '950px',
        top: '179px',
        height: '290px'
      },
      tooltip: {
        direction: 'right',
        left: '710px',
        top: '215px'
      },
      button: {
        top: '285px',
        left: '1050px'
      },
      description:
        'Quick access and download the original design as it was exported by SketchApp.'
    },
    {
      frame: {
        width: '195px',
        left: '940px',
        top: '480px',
        height: '180px'
      },
      tooltip: {
        direction: 'right',
        left: '650px',
        top: '520px'
      },
      button: {
        top: '550px',
        left: '1020px'
      },
      description:
        'Complementary property inspector of each layer including size and dimensions, style information and much more. '
    }
  ];

  editorSections = [{
    frame: {
      width: '175px',
      left: '485px',
      top: '119px',
      height: '35px'
    },
    tooltip: {
      direction: 'right',
      left: '180px',
      top: '85px'
    },
    button: {
      top: '130px',
      left: '472px'
    },
    description:
      'Additional export options to external editors and IDEs, and a handy archive download feature for local development.'
  }, {
    frame: {
      width: '1136px',
      left: '0px',
      top: '195px',
      height: '496px'
    },
    tooltip: {
      direction: 'right',
      left: '213px',
      top: '274px'
    },
    button: {
      top: '308px',
      left: '520px'
    },
    description:
      'A code editor to quickly view the generated code of the current design for the selected technology.'
  }, {
    frame: {
      width: '840px',
      left: '120px',
      top: '150px',
      height: '50px'
    },
    tooltip: {
      direction: 'left',
      left: '750px',
      top: '130px'
    },
    button: {
      top: '162px',
      left: '700px'
    },
    description:
      'Many ouput Web technologies including but not limited to Angular, Vue.js, React, Web Components, etc...'
  }];

  constructor() {}

  ngOnInit() {}
}
