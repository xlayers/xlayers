import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { CurrentLayer, UiState } from '@app/core/state';

export class FileFlatNode {
  name: string;
  _class: any;
  id: string;
  kind: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'xly-tree-layout',
  templateUrl: './layer-tree-layout.component.html',
  styleUrls: ['./layer-tree-layout.component.css']
})
export class TreeViewComponent implements OnInit {
  currentLayer: SketchMSLayer;
  treeFlattener: MatTreeFlattener<SketchMSLayer, FileFlatNode>;
  treeControl: FlatTreeControl<FileFlatNode>;
  dataSource: MatTreeFlatDataSource<SketchMSLayer, FileFlatNode>;
  constructor(private store: Store) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<FileFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.store.select(UiState.currentPage).subscribe(currentPage => {
      if (currentPage) {
        this.dataSource.data = currentPage.layers;
      }
    });
  }

  ngOnInit() {
    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      this.currentLayer = currentLayer;
      if (currentLayer) {
        this.focusOnTreeNode(currentLayer);
      } else {
        this.treeControl.collapseAll();
      }
    });
  }

  /**
   * @todo Find an efficient algorithm
   *
   * @param layer The current layer
   */
  focusOnTreeNode(layer: SketchMSLayer) {
    this.treeControl.collapseAll();
    this.treeControl.dataNodes.some(node => {
      this.treeControl.expand(node);
      if (node.id === layer.do_objectID) {
        return true;
      }
    });

    const element = document.querySelector(
      `mat-tree-node[data-id="${layer.do_objectID}"]`
    );
    if (element && element.scrollIntoView) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  selectLayer(node: SketchMSLayer) {
    this.store.dispatch(new CurrentLayer(node));
  }

  transformer(node: SketchMSLayer, level: number) {
    // use object destructuring to avoid:
    // TypeError: Cannot assign to read only property 'x' of #<Object>
    return {
      ...node,
      level,
      expandable: !!node.layers,
      id: node.do_objectID,
      kind: node._class
    };
  }

  private getLevel(node: /*FileFlatNode*/ any) {
    return node.level;
  }

  private isExpandable(node: FileFlatNode) {
    return node.expandable;
  }

  private getChildren(node: SketchMSLayer): Observable<SketchMSLayer[]> {
    return of(node.layers);
  }

  hasChild(_: number, node: FileFlatNode) {
    return node.expandable;
  }

  getNodeIcon(node: FileFlatNode) {
    const kind = node._class as string;
    switch (kind) {
      case 'rectangle':
      case 'rect':
      case 'shapePath':
        return 'gesture';
      case 'group':
      case 'shapeGroup':
        return 'folder';
      case 'oval':
        return 'panorama_fish_eye';
      case 'text':
        return 'text_format';
      default:
        return 'insert_drive_file';
    }
  }
}
