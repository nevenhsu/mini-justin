interface PostImage {
  id?: string;
  edge_media_to_caption?: { edges: [{ node: { text: string; } }] };
  taken_at_timestamp?: number;
  dimensions?: {height: number, width: number};
  display_url?: string;
  owner?: {id: string};
  thumbnail_src?: string;
  thumbnail_resources?: {thumbnail_resources: [{src: string, config_width: number, config_height: number}]};
  is_video: boolean;
}

