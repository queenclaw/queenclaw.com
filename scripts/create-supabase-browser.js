const puppeteer = require('puppeteer');

const SUPABASE_TOKEN = 'sbp_652189da2436b68e2be9583ac4ee0ed8bea5b04d';

async function createSupabaseProject() {
  console.log('启动浏览器...');
  
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: 'C:\\Users\\calvi\\.puppeteer\\supabase-automation',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // 设置 viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // 访问 Dashboard
    console.log('访问 Supabase Dashboard...');
    await page.goto('https://supabase.com/dashboard', { waitUntil: 'networkidle2' });
    
    // 等待页面加载
    await new Promise(r => setTimeout(r, 3000));
    
    // 截图查看当前状态
    await page.screenshot({ path: 'supabase-dashboard.png' });
    console.log('已截图: supabase-dashboard.png');
    console.log('当前 URL:', page.url());
    
    // 获取页面内容
    const content = await page.content();
    console.log('页面包含 "New Project":', content.includes('New Project'));
    console.log('页面包含 "Sign In":', content.includes('Sign In'));
    console.log('页面包含 "Projects":', content.includes('Projects'));
    
    // 查找 "New Project" 按钮
    const buttons = await page.$$('button');
    console.log(`找到 ${buttons.length} 个按钮`);
    
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const text = await buttons[i].evaluate(el => el.textContent);
      console.log(`按钮 ${i}: ${text?.trim()}`);
    }
    
    // 尝试点击 New Project
    const newProjectBtn = await page.$x("//button[contains(text(), 'New Project')]");
    if (newProjectBtn.length > 0) {
      console.log('找到 New Project 按钮，点击...');
      await newProjectBtn[0].click();
      
      await new Promise(r => setTimeout(r, 3000));
      
      // 填写表单
      console.log('填写项目信息...');
      
      // 项目名称
      const nameInput = await page.$('input[name="name"]');
      if (nameInput) {
        await nameInput.type('queenclaw-production');
      }
      
      // 数据库密码
      const dbPass = generatePassword();
      const passInput = await page.$('input[name="db_pass"]');
      if (passInput) {
        await passInput.type(dbPass);
      }
      console.log('数据库密码:', dbPass);
      
      // 创建项目
      const createBtn = await page.$x("//button[contains(text(), 'Create new project')]");
      if (createBtn.length > 0) {
        await createBtn[0].click();
        console.log('点击创建项目...');
        
        await new Promise(r => setTimeout(r, 10000));
        
        const url = page.url();
        console.log('项目创建完成，URL:', url);
        
        // 保存项目信息
        const fs = require('fs');
        fs.writeFileSync('supabase/project-created.json', JSON.stringify({
          url: url,
          createdAt: new Date().toISOString()
        }, null, 2));
      }
    } else {
      console.log('未找到 New Project 按钮，可能需要登录');
      
      // 查找 Sign In
      const signInBtn = await page.$x("//button[contains(text(), 'Sign In')]");
      if (signInBtn.length > 0) {
        console.log('点击 Sign In...');
        await signInBtn[0].click();
        
        await new Promise(r => setTimeout(r, 3000));
        
        // 查找 GitHub 登录
        const githubBtn = await page.$x("//button[contains(text(), 'GitHub')]");
        if (githubBtn.length > 0) {
          console.log('点击 GitHub 登录...');
          await githubBtn[0].click();
        }
      }
    }
    
    // 最终截图
    await page.screenshot({ path: 'supabase-final.png' });
    console.log('最终截图: supabase-final.png');
    
  } catch (error) {
    console.error('错误:', error);
    await page.screenshot({ path: 'supabase-error.png' });
  }
  
  console.log('浏览器保持打开，请手动完成剩余步骤');
  // 不关闭浏览器以便查看
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
