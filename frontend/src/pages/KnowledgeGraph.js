import React, { useEffect, useRef, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Box, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import * as d3 from 'd3';

const KNOWLEDGE_GRAPH_QUERY = gql`
  query KnowledgeGraph($rootTopic: String!, $depth: Int) {
    knowledgeGraph(rootTopic: $rootTopic, depth: $depth) {
      nodes {
        id
        label
        type
        weight
      }
      edges {
        source
        target
        type
        weight
      }
    }
  }
`;

const KnowledgeGraph = () => {
  const svgRef = useRef();
  const [rootTopic, setRootTopic] = useState('JavaScript');
  const [simulation, setSimulation] = useState(null);
  
  const { loading, error, data } = useQuery(KNOWLEDGE_GRAPH_QUERY, {
    variables: { rootTopic, depth: 3 },
  });

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const width = window.innerWidth;
    const height = window.innerHeight - 200;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create container for the graph
    const g = svg.append('g');

    // Create arrow marker for directed edges
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    // Create forces
    const simulation = d3.forceSimulation(data.knowledgeGraph.nodes)
      .force('link', d3.forceLink(data.knowledgeGraph.edges)
        .id(d => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Create edges
    const edges = g.append('g')
      .selectAll('line')
      .data(data.knowledgeGraph.edges)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.weight))
      .attr('marker-end', 'url(#arrowhead)');

    // Create nodes
    const nodes = g.append('g')
      .selectAll('g')
      .data(data.knowledgeGraph.nodes)
      .enter()
      .append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    nodes.append('circle')
      .attr('r', d => Math.sqrt(d.weight) * 5)
      .attr('fill', d => getNodeColor(d.type));

    // Add labels to nodes
    nodes.append('text')
      .text(d => d.label)
      .attr('x', 12)
      .attr('y', 3)
      .style('font-size', '12px')
      .style('fill', '#fff');

    // Add title for hover effect
    nodes.append('title')
      .text(d => `${d.label}\nType: ${d.type}`);

    // Update positions on each tick
    simulation.on('tick', () => {
      edges
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodes.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    setSimulation(simulation);

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      if (simulation) simulation.stop();
    };
  }, [data]);

  const getNodeColor = (type) => {
    const colors = {
      CONCEPT: '#ff7f0e',
      TOPIC: '#1f77b4',
      SKILL: '#2ca02c',
      RESOURCE: '#d62728',
    };
    return colors[type] || '#999';
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box p={3}>
      <Typography color="error">Error loading knowledge graph: {error.message}</Typography>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          label="Root Topic"
          value={rootTopic}
          onChange={(e) => setRootTopic(e.target.value)}
          variant="outlined"
          sx={{ maxWidth: 400 }}
        />
      </Box>
      <Paper
        sx={{
          flex: 1,
          m: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      </Paper>
    </Box>
  );
};

export default KnowledgeGraph;
