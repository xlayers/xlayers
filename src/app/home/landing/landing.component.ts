import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'sketch-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  version = environment.version;

  viewerSections = [
    {
      frame: {
        width: '300px',
        left: '543px',
        top: '66px',
        height: '50px'
      },
      tooltip: {
        direction: 'right',
        left: '220px',
        top: '28px'
      },
      button: {
        top: '80px',
        left: '514px'
      },
      description:
      'Quick access to layers inspection, zooming functionalities and 3D mode, with the addition of the codegen editor (see below for more details).'
    },
    {
      frame: {
        width: '198px',
        left: '57px',
        top: '153px',
        height: '615px'
      },
      tooltip: {
        direction: 'left',
        left: '280px',
        top: '188px'
      },
      button: {
        top: '430px',
        left: '130px'
      },
      description:
        'Quickly access and inspect the layers hierarchy of the Sketch design.'
    },
    {
      frame: {
        width: '831px',
        left: '279px',
        top: '126px',
        height: '760px'
      },
      tooltip: {
        direction: 'right',
        left: '-50px',
        top: '188px'
      },
      button: {
        top: '430px',
        left: '682px'
      },
      description:
        'A fully fledged design viewer with both 2D and 3D inspection mode allowing you to access all the layers of your design.'
    },
    {
      frame: {
        width: '215px',
        left: '1117px',
        top: '135px',
        height: '385px'
      },
      tooltip: {
        direction: 'right',
        left: '800px',
        top: '285px'
      },
      button: {
        top: '330px',
        left: '1215px'
      },
      description:
        'Quick access and download the original design as it was exported by SketchApp.'
    },
    {
      frame: {
        width: '215px',
        left: '1117px',
        top: '530px',
        height: '212px'
      },
      tooltip: {
        direction: 'right',
        left: '800px',
        top: '595px'
      },
      button: {
        top: '640px',
        left: '1215px'
      },
      description:
        'Complementary property inspector of each layer including size and dimensions, style information and much more. '
    }
  ];

  editorSections = [{
    frame: {
      width: '200px',
      left: '603px',
      top: '66px',
      height: '50px'
    },
    tooltip: {
      direction: 'right',
      left: '280px',
      top: '48px'
    },
    button: {
      top: '82px',
      left: '580px'
    },
    description:
      'Additional export options to external editors and IDEs, and a handy archive download feature for local development.'
  }, {
    frame: {
      width: '1262px',
      left: '63px',
      top: '123px',
      height: '761px'
    },
    tooltip: {
      direction: 'right',
      left: '1003px',
      top: '770px'
    },
    button: {
      top: '548px',
      left: '660px'
    },
    description:
      'A code editor to quickly view the generated code of the current design for the selected technology.'
  }, {
    frame: {
      width: '176px',
      left: '1142px',
      top: '163px',
      height: '186px'
    },
    tooltip: {
      direction: 'right',
      left: '822px',
      top: '212px'
    },
    button: {
      top: '167px',
      left: '1292px'
    },
    description:
      'Many ouput Web technologies including but not limited to Angular, Vue.js, React, Web Components, etc...'
  }];

  constructor() {}

  ngOnInit() {}
}
