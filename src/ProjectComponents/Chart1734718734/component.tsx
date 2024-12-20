import React from 'react';
import ReactECharts from 'echarts-for-react';

import * as MakeInfinite from 'makeinfinite-ui';

type EChartsOption = Record<string, any>;

interface ChartConfigFile {
    echart_config: EChartsOption;
    query_id: string;
    graph_type: string;
}

interface DataRecord {
    [key: string]: any;
}

interface ChartProps {
    chartConfig: ChartConfigFile;
}

const fetchDataset = async (apiHandler: any, queryId: string): Promise<DataRecord[]> => {
    const response = await apiHandler.getQueryContent(queryId);

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
};

const transformData = (
    dataset: DataRecord[],
    graphType: string,
    originalSeries: any[]
): { transformedData: DataRecord[]; newSeries: any[] } => {
    // Check if the graph type requires transformation
    if (graphType === 'stacked_area_chart' || graphType === 'stacked_line_chart' || graphType === 'stacked_column_chart') {
        if (!originalSeries?.[0]) {
            throw new Error('Original series configuration is required for stacked charts');
        }

        const seriesConfig = originalSeries[0];
        const xField = seriesConfig.x;
        const yField = seriesConfig.y;
        const categoryField = seriesConfig.category;

        // Pivot the data using the field names from series config
        const categories = [...new Set(dataset.map(item => item[categoryField]))];
        const xValues = [...new Set(dataset.map(item => item[xField]))];

        const pivotData: DataRecord[] = xValues.map(x => {
            const item: DataRecord = { [xField]: x };
            categories.forEach(category => {
                const found = dataset.find(d => 
                    d[xField] === x && d[categoryField] === category
                );
                item[category] = found ? found[yField] : 0;
            });
            return item;
        });

        const newSeries = categories.map(category => ({
            type: graphType === 'stacked_area_chart' || graphType === 'stacked_line_chart' ? 'line' : 'bar',
            ...(graphType === 'stacked_area_chart' || graphType === 'stacked_column_chart' ? { stack: 'all' } : {}),
            ...(graphType === 'stacked_area_chart' ? { areaStyle: {} } : {}),
            encode: {
                x: xField,
                y: category,
            },
            name: category,
        }));

        return { transformedData: pivotData, newSeries };
    } else {
        // No transformation needed
        return { transformedData: dataset, newSeries: originalSeries };
    }
};

const ChartComponent: React.FC<ChartProps> = ({ chartConfig }) => {
    const { gwAPIHandler } = MakeInfinite.useProject();
    const [options, setOptions] = React.useState<EChartsOption | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const loadChartData = async () => {
            try {
                setLoading(true);
                setError(null);

                const dataset = await fetchDataset(gwAPIHandler, chartConfig.query_id);

                // Transform the data if needed
                const graphType = chartConfig.graph_type;
                const { transformedData, newSeries } = transformData(
                    dataset,
                    graphType,
                    chartConfig.echart_config.series || []
                );

                // Create a new options object combining the config with the transformed dataset
                const completeOptions = {
                    ...chartConfig.echart_config,
                    dataset: {
                        source: transformedData
                    },
                    series: newSeries
                };

                setOptions(completeOptions);
            } catch (error) {
                console.error('Error loading chart:', error);
                setError('Failed to load chart data');
            } finally {
                setLoading(false);
            }
        };

        loadChartData();
    }, [chartConfig]);

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                Loading chart...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    if (!options) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                No chart configuration available
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <ReactECharts
                option={options}
                style={{ height: '400px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
                notMerge={true}
                lazyUpdate={true}
            />
        </div>
    );
};

export { ChartComponent as component };
