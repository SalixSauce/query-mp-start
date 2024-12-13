import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setHighlightedQuote,
  toggleVisibility,
} from '../state/quotesSlice'
import { useGetQuotesQuery, useToggleFakeMutation, useDeleteQuoteMutation } from '../state/quotesApi'

export default function Quotes() {
  const { data: quotes, isLoading: quotesLoading, isFetching: quotesRefreshing } = useGetQuotesQuery()
  const [ toggleFake, {isLoading: togglingQuote} ] = useToggleFakeMutation()
  const [ deleteQuote, {isLoading: deletingQuote }] = useDeleteQuoteMutation()
  // const quotes = [
  //   {
  //     id: 1,
  //     quoteText: "Don't cry because it's over, smile because it happened.",
  //     authorName: "Dr. Seuss",
  //     apocryphal: true,
  //   },
  //   {
  //     id: 2,
  //     quoteText: "So many books, so little time.",
  //     authorName: "Frank Zappa",
  //     apocryphal: false,
  //   },
  //   {
  //     id: 3,
  //     quoteText: "Be yourself; everyone else is already taken.",
  //     authorName: "Oscar Wilde",
  //     apocryphal: false,
  //   },
  // ]
  const displayAllQuotes = useSelector(st => st.quotesState.displayAllQuotes)
  const highlightedQuote = useSelector(st => st.quotesState.highlightedQuote)
  const dispatch = useDispatch()
  return (
    <div id="quotes">
      <h3>Quotes
          {deletingQuote && ' in deletion...'}
          {togglingQuote && ' being toggled...'}
          {(quotesLoading || quotesRefreshing) && ' loading....'}
      </h3>
      <div>
        {
          quotesLoading ? 'quotes loading...' :
          quotes?.filter(qt => {
            return displayAllQuotes || !qt.apocryphal
          })
            .map(qt => (
              <div
                key={qt.id}
                className={`quote${qt.apocryphal ? " fake" : ''}${highlightedQuote === qt.id ? " highlight" : ''}`}
              >
                <div>{qt.quoteText}</div>
                <div>{qt.authorName}</div>
                <div className="quote-buttons">
                  <button onClick={() => deleteQuote(qt.id)}>DELETE</button>
                  <button onClick={() => dispatch(setHighlightedQuote(qt.id))}>HIGHLIGHT</button>
                  <button onClick={() => toggleFake({id: qt.id, quote: { apocryphal: !qt.apocryphal} })}> FAKE</button>
                </div>
              </div>
            ))
        }
        {
          !quotes?.length && "No quotes here! Go write some."
        }
      </div>
      {!!quotes?.length && <button onClick={() => dispatch(toggleVisibility())}>
        {displayAllQuotes ? 'HIDE' : 'SHOW'} FAKE QUOTES
      </button>}
    </div>
  )
}
