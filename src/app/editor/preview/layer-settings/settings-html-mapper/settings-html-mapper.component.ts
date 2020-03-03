import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import { LayerHtmlTagName, UiState } from '@app/core/state';
import { Store } from '@ngxs/store';

export interface HtmlElementGroupItem {
  name: string;
  description: string;
}
export interface HtmlElementGroup {
  type: string;
  elements: HtmlElementGroupItem[];
}

export const includes = (
  opt: HtmlElementGroupItem[],
  value: string
): HtmlElementGroupItem[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item: HtmlElementGroupItem) =>
    item.name.toLowerCase().includes(filterValue)
  );
};

@Component({
  selector: 'xly-settings-html-mapper',
  template: `
    <mat-expansion-panel expanded="true">
      <mat-expansion-panel-header>
        <mat-panel-title>{{
          'SETTINGS_HTML_MAPPER.title' | translate
        }}</mat-panel-title>
      </mat-expansion-panel-header>

      <mat-form-field class="large" [title]="selectedHtmlElementDescription">
        <input
          type="text"
          matInput
          placeholder="Attach an HTML element"
          [ngModel]="currentLayer?.web?.TAG_NAME"
          (ngModelChange)="ngModelChanged($event)"
          [matAutocomplete]="autoGroup"
          (blur)="updateLayerTagNameOnBlur()"
        />
        <mat-autocomplete
          #autoGroup="matAutocomplete"
          [autoActiveFirstOption]="false"
          (optionSelected)="optionSelected($event)"
        >
          <mat-optgroup
            *ngFor="let group of htmlMapperGroupAutocomplete"
            [label]="group.type"
          >
            <mat-option *ngFor="let item of group.elements" [value]="item.name">
              {{ item.name }}
            </mat-option>
          </mat-optgroup>
        </mat-autocomplete>
      </mat-form-field>
    </mat-expansion-panel>
  `,
  styles: [
    `
      :host {
        text-align: left;
      }
      mat-form-field {
        padding: 14px;
      }
      mat-hint {
        height: 130px;
        padding: 14px;
      }
    `
  ]
})
export class SettingsHtmlMapperComponent implements OnInit {
  stateGroups: HtmlElementGroup[] = [
    {
      type: 'Content sectioning',
      elements: [
        {
          name: 'address',
          description: `This element indicates that the enclosed HTML provides contact information for a person or people, or for an organization.`
        },
        {
          name: 'article',
          description: `This element represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable (e.g., in syndication).`
        },
        {
          name: 'aside',
          description: `This element represents a portion of a document whose content is only indirectly related to the document's main content.`
        },
        {
          name: 'footer',
          description: `This element represents a footer for its nearest sectioning content or sectioning root element. A footer typically contains information about the author of the section, copyright data or links to related documents.`
        },
        {
          name: 'header',
          description: `This element represents introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also a logo, a search form, an author name, and other elements.`
        },
        {
          name: 'h1',
          description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`
        },
        {
          name: 'h2',
          description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`
        },
        {
          name: 'h3',
          description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`
        },
        {
          name: 'h4',
          description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`
        },
        {
          name: 'h5',
          description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`
        },
        {
          name: 'h6',
          description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`
        },
        {
          name: 'main',
          description: `This element represents the dominant content of the <body> of a document. The main content area consists of content that is directly related to or expands upon the central topic of a document, or the central functionality of an application.`
        },
        {
          name: 'nav',
          description: `This element represents a section of a page whose purpose is to provide navigation links, either within the current document or to other documents. Common examples of navigation sections are menus, tables of contents, and indexes.`
        },
        {
          name: 'section',
          description: `This element represents a standalone section — which doesn't have a more specific semantic element to represent it — contained within an HTML document.`
        }
      ]
    },
    {
      type: 'Interactive elements',
      elements: [
        {
          name: 'dialog',
          description:
            'This element represents a dialog box or other interactive component, such as a dismissable alert, inspector, or subwindow.'
        },
        {
          name: 'menu',
          description:
            'This element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.'
        }
      ]
    },
    {
      type: 'Text content',
      elements: [
        {
          name: 'dd',
          description: `This element provides the description, definition, or value for the preceding term (<dt>) in a description list (<dl>).`
        },
        {
          name: 'div',
          description: `This element is the generic container for flow content. It has no effect on the content or layout until styled using CSS.`
        },
        {
          name: 'dl',
          description: `This element represents a description list. The element encloses a list of groups of terms (specified using the <dt> element) and descriptions (provided by <dd> elements). Common uses for this element are to implement a glossary or to display metadata (a list of key-value pairs).`
        },
        {
          name: 'dt',
          description: `This element specifies a term in a description or definition list, and as such must be used inside a <dl> element.`
        },
        {
          name: 'hr',
          description: `This element represents a thematic break between paragraph-level elements: for example, a change of scene in a story, or a shift of topic within a section.`
        },
        {
          name: 'li',
          description: `This element is used to represent an item in a list.`
        },
        {
          name: 'main',
          description: `This element represents the dominant content of the <body> of a document. The main content area consists of content that is directly related to or expands upon the central topic of a document, or the central functionality of an application.`
        },
        {
          name: 'ol',
          description: `This element represents an ordered list of items — typically rendered as a numbered list.`
        },
        {
          name: 'p',
          description: `This element represents a paragraph.`
        },
        {
          name: 'pre',
          description: `This element represents preformatted text which is to be presented exactly as written in the HTML file.`
        },
        {
          name: 'ul',
          description: `This element represents an unordered list of items, typically rendered as a bulleted list.`
        }
      ]
    },
    {
      type: 'Inline text semantics',
      elements: [
        {
          name: 'a',
          description: `This element (or anchor element), with its href attribute, creates a hyperlink to web pages, files, email addresses, locations in the same page, or anything else a URL can address.`
        },
        {
          name: 'bdi',
          description: `This element tells the browser's bidirectional algorithm to treat the text it contains in isolation from its surrounding text.`
        },
        {
          name: 'bdo',
          description: `This Override element overrides the current directionality of text, so that the text within is rendered in a different direction.`
        },
        {
          name: 'cite',
          description: `This is used to describe a reference to a cited creative work, and must include the title of that work.`
        },
        {
          name: 'code',
          description: `This element displays its contents styled in a fashion intended to indicate that the text is a short fragment of computer code.`
        },
        {
          name: 'em',
          description: `This element marks text that has stress emphasis. The <em> element can be nested, with each level of nesting indicating a greater degree of emphasis.`
        },
        {
          name: 'i',
          description: `This element represents a range of text that is set off from the normal text for some reason.`
        },
        {
          name: 'kbd',
          description: `This element represents a span of inline text denoting textual user input from a keyboard, voice input, or any other text entry device.`
        },
        {
          name: 'span',
          description: `This element is a generic inline container for phrasing content, which does not inherently represent anything. It can be used to group elements for styling purposes (using the class or id attributes), or because they share attribute values, such as lang.`
        },
        {
          name: 'strong',
          description: `This Element indicates that its contents have strong importance, seriousness, or urgency. Browsers typically render the contents in bold type.`
        },
        {
          name: 'sub',
          description: `This specifies inline text which should be displayed as subscript for solely typographical reasons.`
        },
        {
          name: 'sup',
          description: `This specifies inline text which is to be displayed as superscript for solely typographical reasons.`
        },
        {
          name: 'time',
          description: `This element represents a specific period in time.`
        },
        {
          name: 'u',
          description: `This Element represents a span of inline text which should be rendered in a way that indicates that it has a non-textual annotation.`
        }
      ]
    },
    {
      type: 'Image and multimedia',
      elements: [
        {
          name: 'audio',
          description: `This element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.`
        },
        {
          name: 'img',
          description: `This element embeds an image into the document.`
        },
        {
          name: 'video',
          description: `This (<video>) embeds a media player which supports video playback into the document. You can use <video> for audio content as well, but the <audio> element may provide a more appropriate user experience.`
        }
      ]
    },
    {
      type: 'Forms',
      elements: [
        {
          name: 'button',
          description: `This element represents a clickable button, used to submit forms or anywhere in a document for accessible, standard button functionality.`
        },
        {
          name: 'input',
          description: `This element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.`
        },
        {
          name: 'textarea',
          description: `This element represents a multi-line plain-text editing control, useful when you want to allow users to enter a sizeable amount of free-form text, for example a comment on a review or feedback form.`
        },
        {
          name: 'select',
          description: `This element represents a control that provides a menu of options`
        }
      ]
    }
  ];

  currentLayer: SketchMSLayer;

  DEFAULT_ELEMENT = 'div';

  selectedHtmlElementName = '';
  selectedHtmlElementDescription = '';

  htmlMapperGroupAutocomplete: HtmlElementGroup[];

  @ViewChild(MatAutocompleteTrigger) autocompletePanel: MatAutocompleteTrigger;

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      if (currentLayer) {
        this.autocompletePanel.closePanel();

        this.currentLayer = currentLayer;
        const value = this.currentLayer.web?.TAG_NAME;
        this.selectedHtmlElementDescription = this.getSelectedHtmlElementDescription(
          value
        );
      }
    });
  }

  ngModelChanged(value: string) {
    console.log(value);

    if (value) {
      this.htmlMapperGroupAutocomplete = this.filterGroup(value);
      const desc = this.getSelectedHtmlElementDescription(value);
      if (desc) {
        this.selectedHtmlElementDescription = desc;
      } else {
        // element not found in the list, update description accordingly
        if (value.includes('-')) {
          this.selectedHtmlElementDescription = 'Custom element';
        } else {
          this.selectedHtmlElementDescription = 'Unsupported element';
        }
      }
    } else {
      // reset state
      this.htmlMapperGroupAutocomplete = this.stateGroups;
      this.selectedHtmlElementDescription = '';
      this.autocompletePanel.closePanel();
      this.store.dispatch(new LayerHtmlTagName(null));
    }
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    this.selectedHtmlElementDescription = this.getSelectedHtmlElementDescription(
      value
    );
    this.htmlMapperGroupAutocomplete = [...this.stateGroups];
    this.store.dispatch(new LayerHtmlTagName(value));
  }

  private getSelectedHtmlElementDescription(value: string): string {
    const item = this.find(value);
    return item?.description || '';
  }

  updateLayerTagNameOnBlur() {
    if (this.currentLayer.web.TAG_NAME === '') {
      this.store.dispatch(new LayerHtmlTagName(null));
    }
  }

  private filterGroup(value: string): HtmlElementGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({
          type: group.type,
          elements: includes(group.elements, value)
        }))
        .filter(group => group.elements.length > 0);
    }

    return this.stateGroups;
  }

  private find(value: string): HtmlElementGroupItem {
    if (value) {
      const vals = this.stateGroups.flatMap(group => [...group.elements]);
      return vals.find(item => item.name === value);
    }
    return null;
  }
}
