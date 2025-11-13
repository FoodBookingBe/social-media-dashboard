-- Super Slim AI Marketing Dashboard Database Schema
-- Supabase PostgreSQL Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Social Media Posts Table
CREATE TABLE social_media_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL, -- facebook, instagram, linkedin, twitter, youtube, tiktok
    post_id VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    media_urls TEXT[], -- Array of media URLs
    author_id VARCHAR(255),
    author_name VARCHAR(255),
    posted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    engagement_score INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    hashtags TEXT[],
    mentions TEXT[],
    sentiment_score DECIMAL(3,2) DEFAULT 0, -- -1 to 1 scale
    ai_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(100) NOT NULL, -- google, tripadvisor, facebook, etc.
    review_id VARCHAR(255) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    response_text TEXT,
    response_sent BOOLEAN DEFAULT FALSE,
    sentiment_score DECIMAL(3,2) DEFAULT 0,
    urgency_level VARCHAR(20) DEFAULT 'low', -- low, medium, high, critical
    ai_response_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Local Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(500),
    category VARCHAR(100), -- festival, concert, sports, business, etc.
    expected_attendees INTEGER,
    source VARCHAR(100), -- eventbrite, facebook, local_api, etc.
    event_url VARCHAR(1000),
    ai_content_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather Data Table
CREATE TABLE weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location VARCHAR(255) NOT NULL,
    temperature DECIMAL(5,2),
    humidity INTEGER,
    weather_condition VARCHAR(100), -- sunny, rainy, cloudy, etc.
    wind_speed DECIMAL(5,2),
    precipitation DECIMAL(5,2),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    forecast_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Generated Content Table
CREATE TABLE ai_generated_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type VARCHAR(50) NOT NULL, -- post, caption, image, video, story
    platform VARCHAR(50), -- target platform
    title VARCHAR(500),
    content TEXT,
    media_urls TEXT[],
    hashtags TEXT[],
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    performance_score DECIMAL(5,2) DEFAULT 0,
    ai_model_used VARCHAR(100),
    prompt_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Engagement Metrics Table
CREATE TABLE engagement_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES ai_generated_content(id),
    platform VARCHAR(50) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- likes, shares, comments, views, clicks
    metric_value INTEGER NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Predictive Models Table (for storing learned patterns)
CREATE TABLE predictive_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(255) NOT NULL,
    model_type VARCHAR(100) NOT NULL, -- engagement_prediction, sentiment_analysis, etc.
    model_data JSONB, -- Store model parameters/weights
    accuracy_score DECIMAL(5,4),
    training_data_points INTEGER,
    last_trained TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automated Alerts Table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(100) NOT NULL, -- negative_review, high_engagement, crisis, opportunity
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    title VARCHAR(500) NOT NULL,
    message TEXT,
    related_entity_id UUID, -- ID of related post/review/etc
    related_entity_type VARCHAR(100), -- social_media_posts, reviews, etc.
    ai_generated BOOLEAN DEFAULT TRUE,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(255),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitors Monitoring Table
CREATE TABLE competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    handle VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    follower_count INTEGER,
    engagement_rate DECIMAL(5,4),
    last_analyzed TIMESTAMP WITH TIME ZONE,
    ai_insights TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor Posts Table
CREATE TABLE competitor_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID REFERENCES competitors(id),
    post_id VARCHAR(255) NOT NULL,
    content TEXT,
    engagement_score INTEGER DEFAULT 0,
    posted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ai_analyzed BOOLEAN DEFAULT FALSE,
    insights TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand Guidelines Table
CREATE TABLE brand_guidelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(1000),
    primary_color VARCHAR(7), -- hex color
    secondary_colors TEXT[], -- array of hex colors
    fonts TEXT[], -- array of font names
    tone_of_voice TEXT,
    target_audience TEXT,
    brand_values TEXT[],
    content_pillars TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B Testing Table
CREATE TABLE ab_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_name VARCHAR(255) NOT NULL,
    content_a_id UUID REFERENCES ai_generated_content(id),
    content_b_id UUID REFERENCES ai_generated_content(id),
    winner_id UUID REFERENCES ai_generated_content(id),
    test_metric VARCHAR(50) DEFAULT 'engagement', -- engagement, clicks, conversions
    status VARCHAR(20) DEFAULT 'running', -- running, completed, cancelled
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_social_media_posts_platform_posted_at ON social_media_posts(platform, posted_at DESC);
CREATE INDEX idx_social_media_posts_sentiment ON social_media_posts(sentiment_score);
CREATE INDEX idx_reviews_sentiment_urgency ON reviews(sentiment_score, urgency_level);
CREATE INDEX idx_events_date_location ON events(event_date, location);
CREATE INDEX idx_weather_location_date ON weather_data(location, recorded_at DESC);
CREATE INDEX idx_ai_content_type_platform ON ai_generated_content(content_type, platform);
CREATE INDEX idx_engagement_content_metric ON engagement_metrics(content_id, metric_type);
CREATE INDEX idx_alerts_type_severity ON alerts(alert_type, severity);
CREATE INDEX idx_competitor_posts_competitor ON competitor_posts(competitor_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_social_media_posts_updated_at BEFORE UPDATE ON social_media_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_generated_content_updated_at BEFORE UPDATE ON ai_generated_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_predictive_models_updated_at BEFORE UPDATE ON predictive_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand_guidelines_updated_at BEFORE UPDATE ON brand_guidelines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ab_tests_updated_at BEFORE UPDATE ON ab_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow authenticated users full access for now)
-- In production, you'd want more granular policies
CREATE POLICY "Allow authenticated users to manage social media posts" ON social_media_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage weather data" ON weather_data FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage AI content" ON ai_generated_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage engagement metrics" ON engagement_metrics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage predictive models" ON predictive_models FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage alerts" ON alerts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage competitors" ON competitors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage competitor posts" ON competitor_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage brand guidelines" ON brand_guidelines FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage A/B tests" ON ab_tests FOR ALL USING (auth.role() = 'authenticated');

-- Create views for analytics
CREATE VIEW social_media_analytics AS
SELECT
    platform,
    DATE_TRUNC('day', posted_at) as date,
    COUNT(*) as posts_count,
    AVG(engagement_score) as avg_engagement,
    AVG(sentiment_score) as avg_sentiment,
    SUM(likes_count) as total_likes,
    SUM(shares_count) as total_shares,
    SUM(comments_count) as total_comments
FROM social_media_posts
WHERE posted_at >= NOW() - INTERVAL '30 days'
GROUP BY platform, DATE_TRUNC('day', posted_at)
ORDER BY date DESC, platform;

CREATE VIEW content_performance AS
SELECT
    agc.*,
    COALESCE(SUM(em.metric_value) FILTER (WHERE em.metric_type = 'likes'), 0) as likes,
    COALESCE(SUM(em.metric_value) FILTER (WHERE em.metric_type = 'shares'), 0) as shares,
    COALESCE(SUM(em.metric_value) FILTER (WHERE em.metric_type = 'comments'), 0) as comments,
    COALESCE(SUM(em.metric_value) FILTER (WHERE em.metric_type = 'views'), 0) as views,
    (COALESCE(SUM(em.metric_value) FILTER (WHERE em.metric_type = 'likes'), 0) +
     COALESCE(SUM(em.metric_value) FILTER (WHERE em.metric_type = 'shares'), 0) * 2 +
     COALESCE(SUM(em.metric_value) FILTER (WHERE em.metric_type = 'comments'), 0) * 3) as engagement_score
FROM ai_generated_content agc
LEFT JOIN engagement_metrics em ON agc.id = em.content_id
WHERE agc.published = true
GROUP BY agc.id;

-- Insert initial brand guidelines (placeholder)
INSERT INTO brand_guidelines (brand_name, primary_color, tone_of_voice, target_audience, brand_values)
VALUES ('Default Brand', '#007bff', 'Professioneel, vriendelijk en behulpzaam', '25-45 jaar, stedelijk, digitaal savvy', ARRAY['Kwaliteit', 'Innovatie', 'Klantgericht']);

-- Insert initial predictive model placeholders
INSERT INTO predictive_models (model_name, model_type, accuracy_score, training_data_points)
VALUES
('Engagement Predictor', 'engagement_prediction', 0.75, 1000),
('Sentiment Analyzer', 'sentiment_analysis', 0.82, 5000),
('Content Optimizer', 'content_optimization', 0.68, 2000);
