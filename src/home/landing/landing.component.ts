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
      'LANDING.quick_access_toolbar'
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
        'LANDING.sketch_layer_list'
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
        'LANDING.design_editor_info'
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
        'LANDING.quick_access_preview_download'
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
        'LANDING.property_panel'
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
      'LANDING.code_editor_options'
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
      'LANDING.code_editor_content'
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
      'LANDING.code_editor_tech_list'
  }];

  constructor() {}

  ngOnInit() {}
}
