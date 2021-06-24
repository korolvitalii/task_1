import { renderItems, renderSumTableItems, renderArchivedNotes } from './view';
import getItems from './data';
import {
  countActiveNotes,
  countArchiveNotes,
  getUniqueCategories,
  giveNoteUniqueId,
} from './helpers';
import * as handlers from './handlers';

const app = () => {
  const state = {
    processState: 'table',
    notes: [],
    archiveNotes: [],
    categoriesType: [],
    categories: [],
  };

  const items = getItems();

  const init = () => {
    state.notes = giveNoteUniqueId(items);
    state.categoriesType = getUniqueCategories(items);
    state.categories = getUniqueCategories(items).reduce((acc, note) => ({
      ...acc,
      [note]: {
        active: countActiveNotes(state.notes, note),
        archive: countArchiveNotes(state.archiveNotes, note),
      },
    }), {});
  };
  init();

  const tableElements = {
    ulFirstTable: document.querySelector('.responsive-table'),
    ulResultTable: document.querySelector('.responsive-table-result'),
    ulResponsiveTableArchive: document.querySelector('.responsive-table-archive'),
    button: document.querySelector('.button'),
  };

  switch (state.processState) {
    case 'table':
      renderItems(state.notes, tableElements.ulFirstTable);
      renderSumTableItems(state, tableElements.ulResultTable);
      renderArchivedNotes(state, tableElements.ulResponsiveTableArchive);

      break;
    default:
      break;
  }

  const tableElementsAfterRender = {
    allIconBasketElements: document.querySelectorAll('[data-type=basket]'),
    allIconArchiveElements: document.querySelectorAll('[data-type=archive]'),
    allIconEditElements: document.querySelectorAll('[data-type=edit]'),
    allIcomUnarchiveElements: document.querySelectorAll('[data-type=unarchive'),
    button: document.querySelector('.button'),
  };

  const {
    handleArchive,
    handleRemove,
    handleClick,
    handleEdit,
    handleUnachive,
  } = handlers;

  tableElementsAfterRender.allIconBasketElements.forEach((element) => element.addEventListener('click', handleRemove(handlers, state)));
  tableElementsAfterRender.allIconArchiveElements.forEach((element) => element.addEventListener('click', handleArchive(handlers, state)));
  tableElementsAfterRender.button.addEventListener('click', handleClick(handlers, state));
  tableElementsAfterRender.allIconEditElements.forEach((element) => element.addEventListener('click', handleEdit(handlers, state)));
  tableElementsAfterRender.allIcomUnarchiveElements.forEach((element) => element.addEventListener('click', handleUnachive(handlers, state)));
  return null;
};

export default app;
