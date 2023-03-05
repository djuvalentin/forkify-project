import View from './View.js';
import PreviewView from './previewView.js';

class BookmarksView extends View {
  _parentContainer = document.querySelector('.bookmarks__list');
  _message = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  _generateMarkup() {
    return this._data
      .map(previewData => PreviewView.render(previewData, false))
      .join('');
  }
}

export default new BookmarksView();
