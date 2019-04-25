import styles from './StatsComponent.module.scss';

import React, { Component, PropTypes } from 'react';

import { Table } from 'react-bootstrap';

class StatsComponent extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { salesData } = this.props;

    let salesTable = null;

    if (salesData && salesData.length > 0) {
      const transactions = salesData.map((sale, index) => {
        let dateString = '';
        let hours = '';
        let min = '';
        if (sale.updated) {
          dateString = new Date(sale.updated).toDateString();
          hours = new Date(sale.updated).getHours();
          min = new Date(sale.updated).getMinutes();
        }
        return (<tr key={index}>
          <td>{dateString}</td>
          <td className={styles.wdth_20}>{(hours<10?'0':'') + hours} : {(min<10?'0':'')+ min}</td>
          <td>{sale.price_paid}</td>
          <td>{sale.discounted_price !== undefined && sale.discounted_price !== null ? sale.discounted_price : sale.original_price}</td>
          <td>{sale.coupon_code}</td>
        </tr>);
      });

      salesTable = (<div> <Table bordered condensed hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Sale Price</th>
            <th>Price Paid</th>
            <th>Coupon Code</th>
          </tr>
        </thead>
        <tbody>
          {transactions}
        </tbody>
      </Table>
      </div>);
    } else if (salesData) {
      salesTable = <div style={{ textAlign : 'center' }}><p>No sales to show at this point</p></div>;
    }

    return ( <div className={styles.sales_table}>

        <h2 className={styles.sub_title}>Sales</h2>
        { salesTable }
      </div>
    );

  }

}

StatsComponent.propTypes = {
  salesData           : PropTypes.array,
  statsLoaded         : PropTypes.bool,
  salesLoaded         : PropTypes.bool
};

export default StatsComponent;
