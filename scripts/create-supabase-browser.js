const puppeteer = require('puppeteer');

const SUPABASE_TOKEN = 'sbp_652189da2436b68e2be9583ac4ee0ed8bea5b04d';

async function createSupabaseProject() {
  console.log('启动浏览器...');
  
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: 'C:\\Users\\calvi\\.openclaw\\browser\\openclaw\\user-data',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // 设置 token
    console.log('设置 Supabase token...');
    await page.setCookie({
      name: 'sb-access-token',
      value: SUPABASE_TOKEN,
      domain: '.supabase.com',
      path: '/'
    });
    
    // 访问 Dashboard
    console.log('访问 Supabase Dashboard...');
    await page.goto('https://supabase.com/dashboard', { waitUntil: 'networkidle2' });
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 截图查看当前状态
    await page.screenshot({ path: 'supabase-dashboard.png' });
    console.log('已截图: supabase-dashboard.png');
    
    // 查找 "New Project" 按钮
    const newProjectBtn = await page.$('text/New Project') || 
                          await page.$('button:has-text("New Project")') ||
                          await page.$('[data-testid="new-project-button"]');
    
    if (newProjectBtn) {
      console.log('找到 New Project 按钮，点击...');
      await newProjectBtn.click();
      
      // 等待创建页面
      await page.waitForTimeout(2000);
      
      // 填写项目信息
      console.log('填写项目信息...');
      
      // 项目名称
      await page.fill('input[name="name"]', 'queenclaw-production');
      
      // 数据库密码
      const dbPassword = generatePassword();
      await page.fill('input[name="db_pass"]', dbPassword);
      
      // 选择区域
      await page.selectOption('select[name="region"]', 'ap-southeast-1');
      
      // 创建项目
      const createBtn = await page.$('button:has-text("Create new project")');
      if (createBtn) {
        await createBtn.click();
        console.log('点击创建项目...');
        
        // 等待创建完成
        await page.waitForTimeout(10000);
        
        // 获取项目信息
        const url = page.url();
        console.log('项目创建完成，URL:', url);
        
        // 截图
        await page.screenshot({ path: 'supabase-project-created.png' });
      }
    } else {
      console.log('未找到 New Project 按钮，可能需要登录');
      
      // 查找登录按钮
      const signInBtn = await page.$('text/Sign In') || 
                        await page.$('button:has-text("Sign In")');
      
      if (signInBtn) {
        console.log('需要登录，点击 Sign In...');
        await signInBtn.click();
        
        // 等待登录页面
        await page.waitForTimeout(2000);
        
        // 查找 GitHub 登录
        const githubBtn = await page.$('text/GitHub') ||
                          await page.$('button:has-text("Continue with GitHub")');
        
        if (githubBtn) {
          console.log('点击 GitHub 登录...');
          await githubBtn.click();
          
          // 等待 GitHub 授权
          await page.waitForTimeout(5000);
          
          // 截图
          await page.screenshot({ path: 'supabase-github-auth.png' });
        }
      }
    }
    
  } catch (error) {
    console.error('错误:', error);
  } finally {
    // 保持浏览器打开以便查看
    console.log('浏览器保持打开，请手动完成剩余步骤');
    // await browser.close();
  }
}

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 20; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

createSupabaseProject();
