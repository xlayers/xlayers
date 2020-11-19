import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SelectCodegenKind } from '../../app/core/state/page.state';
import { CodeGenKind } from '../../app/editor/code/editor-container/codegen/codegen.service';
import { environment } from '../../environments/environment';

interface Framework {
  value: string;
  svgIcon: string;
}

@Component({
  selector: 'xly-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  version = environment.version;

  viewerSections = [
    {
      frame: {
        width: '340px',
        left: '400px',
        top: '54px',
        height: '50px',
      },
      tooltip: {
        direction: 'right',
        left: '90px',
        top: '20px',
      },
      button: {
        top: '70px',
        left: '375px',
      },
      description: 'LANDING.quick_access_toolbar',
    },
    {
      frame: {
        width: '200px',
        left: '0px',
        top: '120px',
        height: '640px',
      },
      tooltip: {
        direction: 'left',
        left: '155px',
        top: '338px',
      },
      button: {
        top: '370px',
        left: '80px',
      },
      description: 'LANDING.sketch_layer_list',
    },
    {
      frame: {
        width: '730px',
        left: '203px',
        top: '110px',
        height: '650px',
      },
      tooltip: {
        direction: 'right',
        left: '270px',
        top: '367px',
      },
      button: {
        top: '410px',
        left: '592px',
      },
      description: 'LANDING.design_editor_info',
    },
    {
      frame: {
        width: '180px',
        left: '950px',
        top: '179px',
        height: '290px',
      },
      tooltip: {
        direction: 'right',
        left: '710px',
        top: '215px',
      },
      button: {
        top: '285px',
        left: '1050px',
      },
      description: 'LANDING.quick_access_preview_download',
    },
    {
      frame: {
        width: '195px',
        left: '940px',
        top: '480px',
        height: '180px',
      },
      tooltip: {
        direction: 'right',
        left: '650px',
        top: '520px',
      },
      button: {
        top: '550px',
        left: '1020px',
      },
      description: 'LANDING.property_panel',
    },
  ];

  editorSections = [
    {
      frame: {
        width: '175px',
        left: '485px',
        top: '119px',
        height: '35px',
      },
      tooltip: {
        direction: 'right',
        left: '180px',
        top: '85px',
      },
      button: {
        top: '130px',
        left: '472px',
      },
      description: 'LANDING.code_editor_options',
    },
    {
      frame: {
        width: '1136px',
        left: '0px',
        top: '195px',
        height: '496px',
      },
      tooltip: {
        direction: 'right',
        left: '213px',
        top: '274px',
      },
      button: {
        top: '308px',
        left: '520px',
      },
      description: 'LANDING.code_editor_content',
    },
    {
      frame: {
        width: '840px',
        left: '120px',
        top: '150px',
        height: '50px',
      },
      tooltip: {
        direction: 'left',
        left: '750px',
        top: '130px',
      },
      button: {
        top: '162px',
        left: '700px',
      },
      description: 'LANDING.code_editor_tech_list',
    },
  ];

  public frameworks: Framework[] = [
    {
      value: 'Angular',
      svgIcon: 'angular',
    },
    {
      value: 'AngularElement',
      svgIcon: 'angularElement',
    },
    {
      value: 'Vue',
      svgIcon: 'vue',
    },
    {
      value: 'React',
      svgIcon: 'react',
    },
    {
      value: 'WC',
      svgIcon: 'wc',
    },
    {
      value: 'Stencil',
      svgIcon: 'stencil',
    },
    {
      value: 'LitElement',
      svgIcon: 'litElement',
    },
  ];

  constructor(private router: Router, private readonly store: Store) {}

  ngOnInit() {}

  selectFramework(framework: string) {
    this.store.dispatch(new SelectCodegenKind(CodeGenKind[framework]));
    this.router.navigateByUrl('/upload');
  }
}
