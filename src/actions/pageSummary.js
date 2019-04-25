import { createAction } from 'redux-actions';

export const handlePageSummaryChange = (obj)=>createAction('PAGE_SUMMARY_CHANGE')(obj);

