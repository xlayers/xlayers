import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { CurrentLayer, UiState } from '../../core/state';

export class FileFlatNode {
  name: string;
  _class: any;
  id: string;
  kind: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'sketch-tree-view',
  template: `
    <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <mat-tree-node
        *matTreeNodeDef="let node"
        matTreeNodeToggle
        matTreeNodePadding
        matTreeNodePaddingIndent="20"
        (click)="selectLayer(node)"
        [attr.data-id]="node.id"
        [attr.data-class]="node.kind"
        [ngClass]="{ 'selected' : node.id === currentLayer?.do_objectID}">
        <button mat-icon-button>
          <mat-icon class="kind-icon">
          {{ getNodeIcon(node) }}
          </mat-icon>
         {{node.name}}
        </button>
      </mat-tree-node>

      <mat-tree-node
        *matTreeNodeDef="let node; when: hasChild"
        matTreeNodePadding
        matTreeNodePaddingIndent="20"
        [ngClass]="{ 'selected' : node.id === currentLayer?.do_objectID}"
        [attr.data-id]="node.id"
        [attr.data-class]="node.kind"
        [attr.aria-label]="'toggle ' + node.name"
        (click)="selectLayer(node)">

        <button mat-icon-button>
          <mat-icon
            matTreeNodeToggle
            [matTreeNodeToggleRecursive]="false"
            class="mat-icon-rtl-mirror">
            {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
          </mat-icon>
          <mat-icon class="kind-icon">
            {{ getNodeIcon(node) }}
          </mat-icon>

          {{node.name}}
        </button>

      </mat-tree-node>
    </mat-tree>
  `,
  styles: [
    `
    mat-tree-node {
     cursor: pointer;
    }
    mat-tree-node.selected {
      background-color: #ee4743;
    }

    mat-tree-node button {
      width: auto;
    }

    .kind-icon {
      font-size: 20px;
    }

    .mat-button-wrapper {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 150px;
      white-space: nowrap;
      display: inline-block;
    }
  `
  ]
})
export class TreeViewComponent implements OnInit {
  currentLayer: SketchMSLayer;
  treeFlattener: MatTreeFlattener<SketchMSLayer, FileFlatNode>;
  treeControl: FlatTreeControl<FileFlatNode>;
  dataSource: MatTreeFlatDataSource<SketchMSLayer, FileFlatNode>;
  constructor(private store: Store) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

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

    const element = document.querySelector(`mat-tree-node[data-id="${layer.do_objectID}"]`);
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
    (node as any).level = level;
    (node as any).expandable = !!node.layers;
    (node as any).id = node.do_objectID;
    (node as any).kind = node._class;
    return node;
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
