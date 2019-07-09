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
        width: '240px',
        left: '447px',
        top: '50px',
        height: '50px'
      },
      tooltip: {
        direction: 'right',
        left: '140px',
        top: '12px'
      },
      button: {
        top: '66px',
        left: '414px'
      },
      description:
      'Quick access to layers inspection, zooming functionalities and 3D mode, with the addition of the codegen editor (see below for more details).'
    },
    {
      frame: {
        width: '166px',
        left: '45px',
        top: '120px',
        height: '560px'
      },
      tooltip: {
        direction: 'left',
        left: '230px',
        top: '338px'
      },
      button: {
        top: '370px',
        left: '100px'
      },
      description:
        'Quickly access and inspect the layers hierarchy of the Sketch design.'
    },
    {
      frame: {
        width: '686px',
        left: '226px',
        top: '103px',
        height: '629px'
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
        width: '176px',
        left: '916px',
        top: '103px',
        height: '325px'
      },
      tooltip: {
        direction: 'right',
        left: '610px',
        top: '215px'
      },
      button: {
        top: '270px',
        left: '995px'
      },
      description:
        'Quick access and download the original design as it was exported by SketchApp.'
    },
    {
      frame: {
        width: '176px',
        left: '916px',
        top: '440px',
        height: '291px'
      },
      tooltip: {
        direction: 'right',
        left: '610px',
        top: '535px'
      },
      button: {
        top: '584px',
        left: '1000px'
      },
      description:
        'Complementary property inspector of each layer including size and dimensions, style information and much more. '
    }
  ];

  editorSections = [{
    frame: {
      width: '175px',
      left: '485px',
      top: '50px',
      height: '50px'
    },
    tooltip: {
      direction: 'right',
      left: '180px',
      top: '24px'
    },
    button: {
      top: '67px',
      left: '472px'
    },
    description:
      'Additional export options to external editors and IDEs, and a handy archive download feature for local development.'
  }, {
    frame: {
      width: '1046px',
      left: '46px',
      top: '99px',
      height: '632px'
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
      width: '140px',
      left: '940px',
      top: '135px',
      height: '150px'
    },
    tooltip: {
      direction: 'right',
      left: '634px',
      top: '136px'
    },
    button: {
      top: '152px',
      left: '1042px'
    },
    description:
      'Many ouput Web technologies including but not limited to Angular, Vue.js, React, Web Components, etc...'
  }];

  constructor() {}

  ngOnInit() {}
}
