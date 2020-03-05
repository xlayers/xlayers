import { Injectable } from '@angular/core';

export interface HtmlElementGroup {
  type: string;
  elements: XLayersWebCodeGenTag[];
}

@Injectable({
  providedIn: 'root'
})
export class SettingsHtmlMapperService {
  getHtmlElements(): HtmlElementGroup[] {
    return [
      {
        type: 'Content sectioning',
        elements: [
          {
            name: 'address',
            description: `This element indicates that the enclosed HTML provides contact information for a person or people, or for an organization.`,
            empty: false,
            attributes: []
          },
          {
            name: 'article',
            description: `This element represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable (e.g., in syndication).`,
            empty: false,
            attributes: []
          },
          {
            name: 'aside',
            description: `This element represents a portion of a document whose content is only indirectly related to the document's main content.`,
            empty: false,
            attributes: []
          },
          {
            name: 'footer',
            description: `This element represents a footer for its nearest sectioning content or sectioning root element. A footer typically contains information about the author of the section, copyright data or links to related documents.`,
            empty: false,
            attributes: []
          },
          {
            name: 'header',
            description: `This element represents introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also a logo, a search form, an author name, and other elements.`,
            empty: false,
            attributes: []
          },
          {
            name: 'h1',
            description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`,
            empty: false,
            attributes: []
          },
          {
            name: 'h2',
            description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`,
            empty: false,
            attributes: []
          },
          {
            name: 'h3',
            description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`,
            empty: false,
            attributes: []
          },
          {
            name: 'h4',
            description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`,
            empty: false,
            attributes: []
          },
          {
            name: 'h5',
            description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`,
            empty: false,
            attributes: []
          },
          {
            name: 'h6',
            description: `This elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.`,
            empty: false,
            attributes: []
          },
          {
            name: 'main',
            description: `This element represents the dominant content of the <body> of a document. The main content area consists of content that is directly related to or expands upon the central topic of a document, or the central functionality of an application.`,
            empty: false,
            attributes: []
          },
          {
            name: 'nav',
            description: `This element represents a section of a page whose purpose is to provide navigation links, either within the current document or to other documents. Common examples of navigation sections are menus, tables of contents, and indexes.`,
            empty: false,
            attributes: []
          },
          {
            name: 'section',
            description: `This element represents a standalone section — which doesn't have a more specific semantic element to represent it — contained within an HTML document.`,
            empty: false,
            attributes: []
          }
        ]
      },
      {
        type: 'Interactive elements',
        elements: [
          {
            name: 'dialog',
            description:
              'This element represents a dialog box or other interactive component, such as a dismissable alert, inspector, or subwindow.',
            empty: false,
            attributes: []
          },
          {
            name: 'menu',
            description:
              'This element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.',
            empty: false,
            attributes: []
          }
        ]
      },
      {
        type: 'Text content',
        elements: [
          {
            name: 'dd',
            description: `This element provides the description, definition, or value for the preceding term (<dt>) in a description list (<dl>).`,
            empty: false,
            attributes: []
          },
          {
            name: 'div',
            description: `This element is the generic container for flow content. It has no effect on the content or layout until styled using CSS.`,
            empty: false,
            attributes: []
          },
          {
            name: 'dl',
            description: `This element represents a description list. The element encloses a list of groups of terms (specified using the <dt> element) and descriptions (provided by <dd> elements). Common uses for this element are to implement a glossary or to display metadata (a list of key-value pairs).`,
            empty: false,
            attributes: []
          },
          {
            name: 'dt',
            description: `This element specifies a term in a description or definition list, and as such must be used inside a <dl> element.`,
            empty: false,
            attributes: []
          },
          {
            name: 'hr',
            description: `This element represents a thematic break between paragraph-level elements: for example, a change of scene in a story, or a shift of topic within a section.`,
            empty: true,
            attributes: []
          },
          {
            name: 'li',
            description: `This element is used to represent an item in a list.`,
            empty: false,
            attributes: []
          },
          {
            name: 'ol',
            description: `This element represents an ordered list of items — typically rendered as a numbered list.`,
            empty: false,
            attributes: []
          },
          {
            name: 'p',
            description: `This element represents a paragraph.`,
            empty: false,
            attributes: []
          },
          {
            name: 'pre',
            description: `This element represents preformatted text which is to be presented exactly as written in the HTML file.`,
            empty: false,
            attributes: []
          },
          {
            name: 'ul',
            description: `This element represents an unordered list of items, typically rendered as a bulleted list.`,
            empty: false,
            attributes: []
          }
        ]
      },
      {
        type: 'Inline text semantics',
        elements: [
          {
            name: 'a',
            description: `This element (or anchor element), with its href attribute, creates a hyperlink to web pages, files, email addresses, locations in the same page, or anything else a URL can address.`,
            empty: false,
            attributes: [
              {
                name: 'href'
              }
            ]
          },
          {
            name: 'bdi',
            description: `This element tells the browser's bidirectional algorithm to treat the text it contains in isolation from its surrounding text.`,
            empty: false,
            attributes: []
          },
          {
            name: 'bdo',
            description: `This Override element overrides the current directionality of text, so that the text within is rendered in a different direction.`,
            empty: false,
            attributes: []
          },
          {
            name: 'cite',
            description: `This is used to describe a reference to a cited creative work, and must include the title of that work.`,
            empty: false,
            attributes: []
          },
          {
            name: 'code',
            description: `This element displays its contents styled in a fashion intended to indicate that the text is a short fragment of computer code.`,
            empty: false,
            attributes: []
          },
          {
            name: 'em',
            description: `This element marks text that has stress emphasis. The <em> element can be nested, with each level of nesting indicating a greater degree of emphasis.`,
            empty: false,
            attributes: []
          },
          {
            name: 'i',
            description: `This element represents a range of text that is set off from the normal text for some reason.`,
            empty: false,
            attributes: []
          },
          {
            name: 'kbd',
            description: `This element represents a span of inline text denoting textual user input from a keyboard, voice input, or any other text entry device.`,
            empty: false,
            attributes: []
          },
          {
            name: 'span',
            description: `This element is a generic inline container for phrasing content, which does not inherently represent anything. It can be used to group elements for styling purposes (using the class or id attributes), or because they share attribute values, such as lang.`,
            empty: false,
            attributes: []
          },
          {
            name: 'strong',
            description: `This Element indicates that its contents have strong importance, seriousness, or urgency. Browsers typically render the contents in bold type.`,
            empty: false,
            attributes: []
          },
          {
            name: 'sub',
            description: `This specifies inline text which should be displayed as subscript for solely typographical reasons.`,
            empty: false,
            attributes: []
          },
          {
            name: 'sup',
            description: `This specifies inline text which is to be displayed as superscript for solely typographical reasons.`,
            empty: false,
            attributes: []
          },
          {
            name: 'time',
            description: `This element represents a specific period in time.`,
            empty: false,
            attributes: []
          },
          {
            name: 'u',
            description: `This Element represents a span of inline text which should be rendered in a way that indicates that it has a non-textual annotation.`,
            empty: false,
            attributes: []
          }
        ]
      },
      {
        type: 'Image and multimedia',
        elements: [
          {
            name: 'audio',
            description: `This element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.`,
            empty: false,
            attributes: []
          },
          {
            name: 'img',
            description: `This element embeds an image into the document.`,
            empty: true,
            attributes: [
              {
                name: 'src'
              }
            ]
          },
          {
            name: 'video',
            description: `This (<video>) embeds a media player which supports video playback into the document. You can use <video> for audio content as well, but the <audio> element may provide a more appropriate user experience.`,
            empty: false,
            attributes: []
          }
        ]
      },
      {
        type: 'Form',
        elements: [
          {
            name: 'button',
            description: `This element represents a clickable button, used to submit forms or anywhere in a document for accessible, standard button functionality.`,
            empty: false,
            attributes: []
          },
          {
            name: 'input',
            description: `This element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.`,
            empty: true,
            attributes: [
              {
                name: 'value'
              }
            ]
          },
          {
            name: 'label',
            description: `This element represents a caption for an item in a user interface.`,
            empty: false,
            attributes: []
          },
          {
            name: 'textarea',
            description: `This element represents a multi-line plain-text editing control, useful when you want to allow users to enter a sizeable amount of free-form text, for example a comment on a review or feedback form.`,
            empty: false,
            attributes: []
          },
          {
            name: 'select',
            description: `This element represents a control that provides a menu of options.`,
            empty: false,
            attributes: []
          },
          {
            name: 'option',
            description: `This element is used to define an item contained in a <select>, an <optgroup>, or a <datalist> element. As such, <option> can represent menu items in popups and other lists of items in an HTML document.`,
            empty: false,
            attributes: []
          }
        ]
      }
    ];
  }
}
