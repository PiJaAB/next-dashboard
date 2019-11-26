// @flow
import React from 'react';

const defaultRenderHead = ({ title }) => title;
const defaultRenderBody = (entry, { field }) => entry[field];
const defaultKeyExtractor = ({ key }) => key;

const ResponsiveTable = ({
  className,
  columns,
  data,
  renderHead = defaultRenderHead,
  renderBody = defaultRenderBody,
  columnKeyExtractor = defaultKeyExtractor,
  dataKeyExtractor = defaultKeyExtractor,
}) => {
  const textAlign = ({ textAlign }) => textAlign && `text-align-${textAlign}`;
  const table = columns => (
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th
              key={columnKeyExtractor(column)}
              className={textAlign(column)}
            >
              {(column.renderHead || renderHead)(column)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(entry => (
          <tr key={dataKeyExtractor(entry)}>
            {columns.map(column => (
              <td
                key={columnKeyExtractor(column)}
                className={textAlign(column)}
              >
                {(column.renderBody || renderBody)(entry, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div
      className={[
        'responsive-table',
        className,
      ]
        .filter(className => className)
        .join(' ')}
      >
      <div className="responsive-table-head">
        {table([columns[0]])}
      </div>
      <div className="responsive-table-body">
        {table(columns.slice(1))}
      </div>
    </div>
  );
};

export default ResponsiveTable;
